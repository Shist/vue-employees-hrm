<template>
  <div class="user-skills">
    <AppSpinner v-if="areUserSkillsLoading" />
    <AppErrorSection
      v-else-if="isUserSkillsError"
      :errorMessageKey="userSkillsErrorMessage"
    />
    <div v-else class="user-skills__main-content-wrapper">
      <v-btn
        v-if="isOwner"
        variant="text"
        color="var(--color-btn-gray-text)"
        class="user-skills__add-btn"
        @click="handleOpenCreateModal"
      >
        <v-icon class="user-skills__add-icon">mdi-plus</v-icon>
        <span>{{ $t("userSkillsPage.btnAdd") }}</span>
      </v-btn>
      <span v-if="!userSkills?.length" class="user-skills__no-skills-label">
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
        class="user-skills__delete-btns-footer"
        v-show="skillsForDeletionAmount > 0"
        :style="{ paddingRight: scrollbarWidth }"
      >
        <div class="user-skills__delete-btns-wrapper">
          <v-btn
            variant="text"
            color="var(--color-btn-gray-text)"
            class="user-skills__cancel-deletion-btn"
            @click="clearUserDeletionSkills"
          >
            {{ $t("button.cancelButton") }}
          </v-btn>
          <v-btn
            variant="text"
            color="var(--color-btn-gray-text)"
            class="user-skills__deletion-btn"
            @click="submitUserSkillsDeletion"
          >
            <span class="user-skills__deletion-btn-label">{{
              $t("button.deleteButton")
            }}</span>
            <span class="user-skills__deletion-btn-num">
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
    :userId="userId"
    :userSkills="userSkills"
    :allSkills="allSkills"
    :areAllSkillsLoading="areAllSkillsLoading"
    :isAllSkillsError="isAllSkillsError"
    @onCreateUserSkill="submitUserSkillCreate"
    @onUpdateUserSkill="submitUserSkillUpdate"
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
import SkillModal from "@/components/user/skills/SkillModal.vue";
import SkillsCategory from "@/components/SkillsCategory.vue";
import useToast from "@/composables/useToast";
import useErrorState from "@/composables/useErrorState";
import { getAllSkills } from "@/services/skills";
import {
  createUserSkill,
  deleteUserSkills,
  getUserSkillsById,
  updateUserSkill,
} from "@/services/users/skills";
import handleScrollPadding from "@/utils/handleScrollPadding";
import {
  ISkill,
  ISkillCategoriesMap,
  ICategorySkill,
  ISkillsData,
} from "@/types/skillsStructures";
import {
  IAddOrUpdateProfileSkillInput,
  IDeleteProfileSkillInput,
} from "@/types/pages/users/skills";

const { t } = useI18n({ useScope: "global" });

const { scrollbarWidth } = storeToRefs(useScrollbarWidth());

const route = useRoute();

const userId = computed<string>(() => {
  // eslint-disable-next-line
  const [section, userId, tab] = route.fullPath.slice(1).split("/");
  return userId;
});

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === userId.value);

const { setErrorToast } = useToast();

const {
  isLoading: areUserSkillsLoading,
  isError: isUserSkillsError,
  errorMessageKey: userSkillsErrorMessage,
  setErrorValuesToDefault: setUserSkillsErrorValuesToDefault,
  setErrorValues: setUserSkillsErrorValues,
} = useErrorState();

const {
  isLoading: areAllSkillsLoading,
  isError: isAllSkillsError,
  setErrorValuesToDefault: setAllSkillsErrorValuesToDefault,
  setErrorValues: setAllSkillsErrorValues,
} = useErrorState();

const userSkills = ref<ISkill[] | null>(null);
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
  if (!userSkills.value) return null;

  const resultObj: ISkillCategoriesMap = {};

  userSkills.value.forEach((skill, index) => {
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

function updateUserSkillsValue(userSkillsData: ISkill[]) {
  skillsForDeletionNames.clear();
  aSkillsDeletionState.splice(
    0,
    aSkillsDeletionState.length,
    ...new Array(userSkillsData.length).fill(false)
  );
  userSkills.value = userSkillsData;
}

async function fetchUserSkills() {
  areUserSkillsLoading.value = true;

  try {
    const userSkillsData = await getUserSkillsById(userId.value);

    if (!userSkillsData) return;

    updateUserSkillsValue(userSkillsData);

    setUserSkillsErrorValuesToDefault();
  } catch (error: unknown) {
    setUserSkillsErrorValues(error);
  } finally {
    areUserSkillsLoading.value = false;
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
  await fetchUserSkills();
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

function submitUserSkillCreate(skillInputObj: IAddOrUpdateProfileSkillInput) {
  if (!isOwner.value) return;

  areUserSkillsLoading.value = true;

  createUserSkill(skillInputObj)
    .then((freshUserSkills) => {
      if (!freshUserSkills) return;
      updateUserSkillsValue(freshUserSkills);

      setUserSkillsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setUserSkillsErrorValues(error);
    })
    .finally(() => {
      areUserSkillsLoading.value = false;
    });
}

function submitUserSkillUpdate(skillInputObj: IAddOrUpdateProfileSkillInput) {
  if (!isOwner.value) return;

  areUserSkillsLoading.value = true;

  updateUserSkill(skillInputObj)
    .then((freshUserSkills) => {
      if (!freshUserSkills) return;
      updateUserSkillsValue(freshUserSkills);

      setUserSkillsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setUserSkillsErrorValues(error);
    })
    .finally(() => {
      areUserSkillsLoading.value = false;
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

function clearUserDeletionSkills() {
  skillsForDeletionNames.clear();

  aSkillsDeletionState.fill(false);
}

function submitUserSkillsDeletion() {
  if (!isOwner.value) return;

  areUserSkillsLoading.value = true;

  const skillsToBeDeleted: IDeleteProfileSkillInput = {
    userId: Number(userId.value),
    name: [...skillsForDeletionNames],
  };

  deleteUserSkills(skillsToBeDeleted)
    .then((freshUserSkills) => {
      if (!freshUserSkills) return;
      updateUserSkillsValue(freshUserSkills);

      setUserSkillsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setUserSkillsErrorValues(error);
    })
    .finally(() => {
      areUserSkillsLoading.value = false;
    });

  clearUserDeletionSkills();
}
</script>

<style lang="scss" scoped>
.user-skills {
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
    .user-skills__add-btn {
      font-size: 18px;
      line-height: 28px;
      text-transform: none;
      border-radius: 0;
      .user-skills__add-icon {
        font-size: 28px;
      }
    }
    .user-skills__no-skills-label {
      @include default-text(28px, 32px);
      color: var(--color-gray-label-text);
      text-align: center;
      @media (max-width: $phone-l) {
        font-size: 24px;
        line-height: 28px;
      }
    }
    .user-skills__delete-btns-footer {
      padding-block: 32px;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(
        rgba(255, 255, 255, 0) 0%,
        rgb(var(--color-wrapper-bg-rgb)) 40%
      );
      .user-skills__delete-btns-wrapper {
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
        .user-skills__cancel-deletion-btn {
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
        .user-skills__deletion-btn {
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
          .user-skills__deletion-btn-label {
            color: var(--color-btn-text);
            @media (max-width: $phone-l) {
              font-size: 9px;
            }
          }
          .user-skills__deletion-btn-num {
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

:deep(.user-skills__add-btn .v-btn__content) {
  column-gap: 16px;
}
:deep(.user-skills__deletion-btn .v-btn__content) {
  column-gap: 12px;
  @media (max-width: $phone-l) {
    column-gap: 8px;
  }
}
:deep(.user-skills__cancel-deletion-btn .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 9px;
  }
}
</style>
