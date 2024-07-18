<template>
  <div class="cv-skills">
    <AppSpinner v-if="isLoading" />
    <AppErrorSection v-else-if="isError" :errorMessage="errorMessage" />
    <div v-else class="cv-skills__main-content-wrapper">
      <v-btn
        v-if="isOwner"
        variant="text"
        color="var(--color-btn-gray-text)"
        class="cv-skills__add-btn"
        @click="handleOpenCreateModal"
      >
        <v-icon class="cv-skills__add-icon">mdi-plus</v-icon>
        <span>Add skill</span>
      </v-btn>
      <span v-if="!cvSkills?.length" class="cv-skills__no-skills-label">
        No CV skills specified yet
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
        v-show="skillsForDeletionAmount > 0"
        class="cv-skills__delete-btns-wrapper"
      >
        <v-btn
          variant="text"
          color="var(--color-btn-gray-text)"
          class="cv-skills__cancel-deletion-btn"
          @click="clearCvDeletionSkills"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          color="var(--color-btn-gray-text)"
          class="cv-skills__deletion-btn"
          @click="submitCvSkillsDeletion"
        >
          <span class="cv-skills__deletion-btn-label">Delete</span>
          <span class="cv-skills__deletion-btn-num">
            {{ skillsForDeletionAmount }}
          </span>
        </v-btn>
      </div>
    </div>
  </div>
  <SkillModal
    :isOpen="isModalOpen"
    :oSkillForModal="oSkillForModal"
    :cvId="cvId"
    :skills="leftSkills"
    :skill-categories="skillCategories"
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
import SkillModal from "@/components/cv/skills/SkillModal.vue";
import SkillsCategory from "@/components/SkillsCategory.vue";
import useErrorState from "@/composables/useErrorState";
import { getAllSkills, getSkillCategories } from "@/services/skills";
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
  IAddOrUpdateCvSkillInput,
  IDeleteCvSkillInput,
} from "@/types/skillsUI";

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

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const cvSkills = ref<ISkill[] | null>(null);
const skills = ref<ISkillsData[] | null>(null);
const skillCategories = ref<string[] | null>(null);

const leftSkills = computed<ISkillsData[]>(() => {
  if (!cvSkills.value || !skills.value) {
    return [];
  }

  const cvSkillsSet = new Set(cvSkills.value.map((skill) => skill.name));

  return skills.value.filter((skill) => !cvSkillsSet.has(skill.name));
});

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

watch(cvId, () => {
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

function fetchData() {
  isLoading.value = true;

  Promise.all([
    getCvSkillsById(cvId.value),
    getAllSkills(),
    getSkillCategories(),
  ])
    .then(([cvSkillsData, skillsData, skillCategoriesData]) => {
      if (!cvSkillsData || !skillsData || !skillCategoriesData) return;
      updateCvSkillsValue(cvSkillsData);

      skills.value = skillsData;

      skillCategories.value = skillCategoriesData;

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
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

  isLoading.value = true;

  createCvSkill(skillInputObj)
    .then((freshCvSkills) => {
      if (!freshCvSkills) return;
      updateCvSkillsValue(freshCvSkills);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function submitCvSkillUpdate(skillInputObj: IAddOrUpdateCvSkillInput) {
  if (!isOwner.value) return;

  isLoading.value = true;

  updateCvSkill(skillInputObj)
    .then((freshCvSkills) => {
      if (!freshCvSkills) return;
      updateCvSkillsValue(freshCvSkills);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function handleCloseModal() {
  isModalOpen.value = false;
}

function handleSetCardForDeletion(skillName: string, skillIndex: number) {
  if (!isOwner.value) return;

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

  isLoading.value = true;

  const skillsToBeDeleted: IDeleteCvSkillInput = {
    cvId: Number(cvId.value),
    name: [...skillsForDeletionNames],
  };

  deleteCvSkills(skillsToBeDeleted)
    .then((freshCvSkills) => {
      if (!freshCvSkills) return;
      updateCvSkillsValue(freshCvSkills);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
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
  &__main-content-wrapper {
    position: relative;
    margin: 0 auto;
    max-width: 850px;
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 32px;
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
    }
    .cv-skills__delete-btns-wrapper {
      padding-block: 32px;
      margin: 0 auto;
      position: fixed;
      bottom: 0;
      max-width: 800px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(
        rgba(255, 255, 255, 0) 0%,
        rgb(var(--color-wrapper-bg-rgb)) 40%
      );
      .cv-skills__cancel-deletion-btn {
        padding: 6px;
        max-width: 100px;
        width: 100%;
        color: var(--color-btn-gray-text);
        background-color: var(--color-wrapper-bg);
        border-radius: 0;
        border: 1px solid rgba(var(--color-btn-gray-text-rgb), 0.5);
        &:hover {
          background-color: rgba(var(--color-btn-gray-text-rgb), 0.08);
          border: 1px solid var(--color-btn-gray-text);
        }
      }
      .cv-skills__deletion-btn {
        padding: 6px;
        max-width: 120px;
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
        .cv-skills__deletion-btn-label {
          color: var(--color-btn-text);
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

:deep(.cv-skills__add-btn .v-btn__content) {
  column-gap: 16px;
}
:deep(.cv-skills__deletion-btn .v-btn__content) {
  column-gap: 12px;
}
</style>
