<template>
  <div class="user-skills">
    <AppSpinner v-if="isLoading" />
    <AppErrorSection v-else-if="isError" :errorMessage="errorMessage" />
    <div v-else-if="userSkills" class="user-skills__main-content-wrapper">
      <v-btn
        v-if="isOwner"
        variant="text"
        color="var(--color-btn-gray-text)"
        class="user-skills__add-btn"
        @click="handleOpenCreateModal"
      >
        <v-icon class="user-skills__add-icon">mdi-plus</v-icon>
        <span>Add skill</span>
      </v-btn>
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
        class="user-skills__delete-btns-wrapper"
      >
        <v-btn
          variant="text"
          color="var(--color-btn-gray-text)"
          class="user-skills__cancel-deletion-btn"
          @click="clearUserDeletionSkills"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          color="var(--color-btn-gray-text)"
          class="user-skills__deletion-btn"
          @click="submitUserSkillsDeletion"
        >
          <span class="user-skills__deletion-btn-label">Delete</span>
          <span class="user-skills__deletion-btn-num">
            {{ skillsForDeletionAmount }}
          </span>
        </v-btn>
      </div>
    </div>
  </div>
  <SkillModal
    :isOpen="isModalOpen"
    :oSkillForModal="oSkillForModal"
    :userID="id"
    :skills="leftSkills"
    :skill-categories="skillCategories"
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
import SkillModal from "@/components/user/skills/SkillModal.vue";
import SkillsCategory from "@/components/SkillsCategory.vue";
import useErrorState from "@/composables/useErrorState";
import { getAllSkills, getSkillCategories } from "@/services/skills";
import {
  createUserSkill,
  deleteUserSkills,
  getUserSkillsByID,
  updateUserSkill,
} from "@/services/users/skills";
import handleScrollPadding from "@/utils/handleScrollPadding";
import {
  IAddOrUpdateProfileSkillInput,
  IDeleteProfileSkillInput,
} from "@/types/backend-interfaces/user/profile/skill";
import {
  ISkill,
  ISkillCategoriesMap,
  ICategorySkill,
  ISkillsData,
} from "@/types/skillsUI";

const route = useRoute();

const id = computed<string>(() => {
  // eslint-disable-next-line
  const [section, id, tab] = route.fullPath.slice(1).split("/");
  return id;
});

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === id.value);

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const userSkills = ref<ISkill[] | null>(null);
const skills = ref<ISkillsData[] | null>(null);
const skillCategories = ref<string[] | null>(null);

const leftSkills = computed<ISkillsData[]>(() => {
  if (!userSkills.value || !skills.value) {
    return [];
  }

  const userSkillsSet = new Set(userSkills.value.map((skill) => skill.name));

  return skills.value.filter((skill) => !userSkillsSet.has(skill.name));
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

watch(id, () => {
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

function fetchData() {
  isLoading.value = true;

  Promise.all([
    getUserSkillsByID(id.value),
    getAllSkills(),
    getSkillCategories(),
  ])
    .then(([userSkillsData, skillsData, skillCategoriesData]) => {
      if (!userSkillsData || !skillsData || !skillCategoriesData) return;
      updateUserSkillsValue(userSkillsData);

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

function submitUserSkillCreate(skillInputObj: IAddOrUpdateProfileSkillInput) {
  if (!isOwner.value) return;

  isLoading.value = true;

  createUserSkill(skillInputObj)
    .then((freshUserSkills) => {
      if (!freshUserSkills) return;
      updateUserSkillsValue(freshUserSkills);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function submitUserSkillUpdate(skillInputObj: IAddOrUpdateProfileSkillInput) {
  if (!isOwner.value) return;

  isLoading.value = true;

  updateUserSkill(skillInputObj)
    .then((freshUserSkills) => {
      if (!freshUserSkills) return;
      updateUserSkillsValue(freshUserSkills);

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

function clearUserDeletionSkills() {
  skillsForDeletionNames.clear();

  aSkillsDeletionState.fill(false);
}

function submitUserSkillsDeletion() {
  if (!isOwner.value) return;

  isLoading.value = true;

  const skillsToBeDeleted: IDeleteProfileSkillInput = {
    userId: Number(id.value),
    name: [...skillsForDeletionNames],
  };

  deleteUserSkills(skillsToBeDeleted)
    .then((freshUserSkills) => {
      if (!freshUserSkills) return;
      updateUserSkillsValue(freshUserSkills);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });

  clearUserDeletionSkills();
}
</script>

<style lang="scss" scoped>
.user-skills {
  margin: 0 auto;
  padding: 64px 24px;
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
    .user-skills__add-btn {
      font-size: 18px;
      line-height: 28px;
      text-transform: none;
      border-radius: 0;
      .user-skills__add-icon {
        font-size: 28px;
      }
    }
    .user-skills__delete-btns-wrapper {
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
      .user-skills__cancel-deletion-btn {
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
      .user-skills__deletion-btn {
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
        .user-skills__deletion-btn-label {
          color: var(--color-btn-text);
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

:deep(.user-skills__add-btn .v-btn__content) {
  column-gap: 16px;
}
:deep(.user-skills__deletion-btn .v-btn__content) {
  column-gap: 12px;
}
</style>
