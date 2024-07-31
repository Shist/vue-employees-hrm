<template>
  <div class="cv-skills">
    <AppSpinner v-if="areCvSkillsLoading" />
    <AppErrorSection
      v-else-if="isCvSkillsError"
      :errorMessageKey="cvSkillsErrorMessage"
    />
    <div v-else class="cv-skills__main-content-wrapper">
      <v-btn
        v-if="isOwner"
        variant="text"
        color="var(--color-btn-gray-text)"
        class="cv-skills__add-btn"
        @click="handleOpenCreateModal"
      >
        <v-icon class="cv-skills__add-icon">mdi-plus</v-icon>
        <span>{{ $t("userSkillsPage.btnAdd") }}</span>
      </v-btn>
      <span v-if="!cvSkills?.length" class="cv-skills__no-skills-label">
        {{ $t("userSkillsPage.noSkillsMsg") }}
      </span>
      <SkillsCategory
        v-for="(aSkills, sCategory) in skillCategoriesMap"
        :key="sCategory"
        :category="sCategory.toString()"
        :category-skills="aSkills"
        @openEditModal="handleOpenEditModal"
        @setCardForDeletion="handleSetCardForDeletion"
      />
      <div
        class="cv-skills__delete-btns-footer"
        v-show="skillsForDeletionAmount > 0"
        :style="{ paddingRight: scrollbarWidth }"
      >
        <div class="cv-skills__delete-btns-wrapper">
          <v-btn
            variant="text"
            color="var(--color-btn-gray-text)"
            class="cv-skills__cancel-deletion-btn"
            @click="clearCvDeletionSkills"
          >
            {{ $t("button.cancelButton") }}
          </v-btn>
          <v-btn
            variant="text"
            color="var(--color-btn-gray-text)"
            class="cv-skills__deletion-btn"
            @click="submitCvSkillsDeletion"
          >
            <span class="cv-skills__deletion-btn-label">{{
              $t("button.deleteButton")
            }}</span>
            <span class="cv-skills__deletion-btn-num">
              {{ skillsForDeletionAmount }}
            </span>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
  <SkillModal
    :isOpen="isModalOpen"
    :oSkillForModal="oSkillForModal"
    :cvId="cvId"
    :cvSkills="cvSkills"
    :allSkills="allSkills"
    :areAllSkillsLoading="areAllSkillsLoading"
    :isAllSkillsError="isAllSkillsError"
    @onCreateCvSkill="submitCvSkillCreate"
    @onUpdateCvSkill="submitCvSkillUpdate"
    @closeModal="handleCloseModal"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useScrollbarWidth } from "@/store/scrollbarWidth";
import { useI18n } from "vue-i18n";
import SkillModal from "@/components/cv/skills/SkillModal.vue";
import SkillsCategory from "@/components/SkillsCategory.vue";
import useToast from "@/composables/useToast";
import useErrorState from "@/composables/useErrorState";
import { getAllSkills } from "@/services/skills";
import {
  getCvSkillsById,
  createCvSkill,
  updateCvSkill,
  deleteCvSkills,
} from "@/services/cvs/skills";
import handleScrollPadding from "@/utils/handleScrollPadding";
import {
  ISkill,
  ICvSkillsServerData,
  ISkillCategoriesMap,
  ICategorySkill,
  ISkillsData,
} from "@/types/skillsStructures";
import {
  IAddOrUpdateCvSkillInput,
  IDeleteCvSkillInput,
} from "@/types/pages/cvs/skills";

const { t } = useI18n({ useScope: "global" });

const { scrollbarWidth } = storeToRefs(useScrollbarWidth());

const route = useRoute();

const cvId = computed<string>(() => {
  // eslint-disable-next-line
  const [section, cvId, tab] = route.fullPath.slice(1).split("/");
  return cvId;
});

const cvUserId = ref<string | null>(null);

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === cvUserId.value);

const { setErrorToast } = useToast();

const {
  isLoading: areCvSkillsLoading,
  isError: isCvSkillsError,
  errorMessageKey: cvSkillsErrorMessage,
  setErrorValuesToDefault: setCvSkillsErrorValuesToDefault,
  setErrorValues: setCvSkillsErrorValues,
} = useErrorState();

const {
  isLoading: areAllSkillsLoading,
  isError: isAllSkillsError,
  setErrorValuesToDefault: setAllSkillsErrorValuesToDefault,
  setErrorValues: setAllSkillsErrorValues,
} = useErrorState();

const cvSkills = ref<ISkill[] | null>(null);
const allSkills = ref<ISkillsData[] | null>(null);

const oSkillForModal = ref<ISkill | null>(null);
const isModalOpen = ref(false);

const skillsForDeletionNames = reactive(new Set<string>());

const aSkillsDeletionState = reactive<boolean[]>([]);

const skillsForDeletionAmount = computed<number>(() => {
  return aSkillsDeletionState.reduce((acc, isDeleting) => {
    if (isDeleting) acc++;
    return acc;
  }, 0);
});

const skillCategoriesMap = computed(() => {
  if (!cvSkills.value) return null;

  const resultObj: ISkillCategoriesMap = {};

  cvSkills.value.forEach((skill, index) => {
    const category = skill.category;

    const oCategorySkill: ICategorySkill = {
      name: skill.name,
      mastery: skill.mastery,
      skillIndex: index,
      isDeleting: aSkillsDeletionState[index],
    };

    if (category) {
      if (resultObj[category]) {
        resultObj[category].push(oCategorySkill);
      } else {
        resultObj[category] = [oCategorySkill];
      }
    } else {
      if (resultObj["Other skills"]) {
        resultObj["Other skills"].push(oCategorySkill);
      } else {
        resultObj["Other skills"] = [oCategorySkill];
      }
    }
  });

  return resultObj;
});

onMounted(() => {
  fetchData();
});

watch(isModalOpen, (newValue) => {
  handleScrollPadding(newValue);
});

function updateCvSkillsValue(cvSkillsData: ICvSkillsServerData) {
  skillsForDeletionNames.clear();
  aSkillsDeletionState.splice(
    0,
    aSkillsDeletionState.length,
    ...new Array(cvSkillsData.skills.length).fill(false)
  );
  cvSkills.value = cvSkillsData.skills;

  if (cvSkillsData.user) {
    cvUserId.value = cvSkillsData.user.id;
  }
}

async function fetchCvSkills() {
  areCvSkillsLoading.value = true;

  try {
    const cvSkillsData = await getCvSkillsById(cvId.value);

    if (!cvSkillsData) return;

    updateCvSkillsValue(cvSkillsData);

    setCvSkillsErrorValuesToDefault();
  } catch (error: unknown) {
    setCvSkillsErrorValues(error);
  } finally {
    areCvSkillsLoading.value = false;
  }
}

async function fetchAllSkills() {
  areAllSkillsLoading.value = true;

  try {
    const skillsData = await getAllSkills();

    if (!skillsData) return;

    allSkills.value = skillsData;

    setAllSkillsErrorValuesToDefault();
  } catch (error: unknown) {
    setAllSkillsErrorValues(error);

    setErrorToast(t("errors.FAILED_TO_LOAD_SKILLS"));
  } finally {
    areAllSkillsLoading.value = false;
  }
}

async function fetchData() {
  await fetchCvSkills();
  await fetchAllSkills();
}

function handleOpenCreateModal() {
  if (!isOwner.value) return;

  oSkillForModal.value = null;
  isModalOpen.value = true;
}

function handleOpenEditModal(
  _oSkillForModal: ISkill,
  skillName: string,
  skillIndex: number
) {
  if (!isOwner.value) return;

  if (aSkillsDeletionState[skillIndex]) {
    skillsForDeletionNames.delete(skillName);
    aSkillsDeletionState[skillIndex] = false;
  } else {
    oSkillForModal.value = _oSkillForModal;
    isModalOpen.value = true;
  }
}

function submitCvSkillCreate(skillInputObj: IAddOrUpdateCvSkillInput) {
  if (!isOwner.value) return;

  areCvSkillsLoading.value = true;

  createCvSkill(skillInputObj)
    .then((freshCvSkills) => {
      if (!freshCvSkills) return;
      updateCvSkillsValue(freshCvSkills);

      setCvSkillsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setCvSkillsErrorValues(error);
    })
    .finally(() => {
      areCvSkillsLoading.value = false;
    });
}

function submitCvSkillUpdate(skillInputObj: IAddOrUpdateCvSkillInput) {
  if (!isOwner.value) return;

  areCvSkillsLoading.value = true;

  updateCvSkill(skillInputObj)
    .then((freshCvSkills) => {
      if (!freshCvSkills) return;
      updateCvSkillsValue(freshCvSkills);

      setCvSkillsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setCvSkillsErrorValues(error);
    })
    .finally(() => {
      areCvSkillsLoading.value = false;
    });
}

function handleCloseModal() {
  isModalOpen.value = false;
}

function handleSetCardForDeletion(
  skillName: string,
  skillIndex: number,
  isContextMenuTouch: boolean
) {
  if (!isOwner.value || isContextMenuTouch) return;

  if (skillsForDeletionNames.has(skillName)) {
    skillsForDeletionNames.delete(skillName);
    aSkillsDeletionState[skillIndex] = false;
  } else {
    skillsForDeletionNames.add(skillName);
    aSkillsDeletionState[skillIndex] = true;
  }
}

function clearCvDeletionSkills() {
  skillsForDeletionNames.clear();

  aSkillsDeletionState.fill(false);
}

function submitCvSkillsDeletion() {
  if (!isOwner.value) return;

  areCvSkillsLoading.value = true;

  const skillsToBeDeleted: IDeleteCvSkillInput = {
    cvId: Number(cvId.value),
    name: [...skillsForDeletionNames],
  };

  deleteCvSkills(skillsToBeDeleted)
    .then((freshCvSkills) => {
      if (!freshCvSkills) return;
      updateCvSkillsValue(freshCvSkills);

      setCvSkillsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setCvSkillsErrorValues(error);
    })
    .finally(() => {
      areCvSkillsLoading.value = false;
    });

  clearCvDeletionSkills();
}
</script>

<style lang="scss" scoped>
.cv-skills {
  margin: 0 auto;
  padding: 64px 24px 100px;
  max-width: 850px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: $tablet-l) {
    padding: 32px 12px 92px;
  }
  @media (max-width: $phone-l) {
    padding: 16px 10px 84px;
  }
  &__main-content-wrapper {
    position: relative;
    margin: 0 auto;
    max-width: 850px;
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 32px;
    @media (max-width: $tablet-l) {
      row-gap: 20px;
    }
    @media (max-width: $phone-l) {
      row-gap: 15px;
    }
    .cv-skills__add-btn {
      font-size: 18px;
      line-height: 28px;
      text-transform: none;
      border-radius: 0;
      .cv-skills__add-icon {
        font-size: 28px;
      }
    }
    .cv-skills__no-skills-label {
      @include default-text(28px, 32px);
      color: var(--color-gray-label-text);
      text-align: center;
      @media (max-width: $phone-l) {
        font-size: 24px;
        line-height: 28px;
      }
    }
    .cv-skills__delete-btns-footer {
      padding-block: 32px;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(
        rgba(255, 255, 255, 0) 0%,
        rgb(var(--color-wrapper-bg-rgb)) 40%
      );
      .cv-skills__delete-btns-wrapper {
        margin: 0 auto;
        max-width: 810px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: 10px;
        @media (max-width: $laptop-m) {
          max-width: none;
          padding-inline: 70px;
        }
        @media (max-width: $tablet-l) {
          padding-block: 28px;
        }
        @media (max-width: $phone-l) {
          padding-inline: 30px;
          padding-block: 24px;
        }
        .cv-skills__cancel-deletion-btn {
          padding: 6px;
          max-width: 150px;
          width: 100%;
          color: var(--color-btn-gray-text);
          background-color: var(--color-wrapper-bg);
          border-radius: 0;
          border: 1px solid rgba(var(--color-btn-gray-text-rgb), 0.5);
          &:hover {
            background-color: rgba(var(--color-btn-gray-text-rgb), 0.08);
            border: 1px solid var(--color-btn-gray-text);
          }
          @media (max-width: $phone-l) {
            max-width: 100px;
          }
        }
        .cv-skills__deletion-btn {
          padding: 6px;
          max-width: 150px;
          width: 100%;
          background-color: var(--color-btn-bg);
          border-radius: 0;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
            rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
            rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
          &:hover {
            background-color: var(--color-btn-bg-hover);
          }
          &:disabled {
            filter: grayscale(50%);
          }
          @media (max-width: $phone-l) {
            max-width: 100px;
          }
          .cv-skills__deletion-btn-label {
            color: var(--color-btn-text);
            @media (max-width: $phone-l) {
              font-size: 9px;
            }
          }
          .cv-skills__deletion-btn-num {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: var(--color-btn-text);
            color: var(--color-btn-bg);
          }
        }
      }
    }
  }
}

:deep(.cv-skills__add-btn .v-btn__content) {
  column-gap: 16px;
}
:deep(.cv-skills__deletion-btn .v-btn__content) {
  column-gap: 12px;
  @media (max-width: $phone-l) {
    column-gap: 8px;
  }
}
:deep(.cv-skills__cancel-deletion-btn .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 9px;
  }
}
</style>
