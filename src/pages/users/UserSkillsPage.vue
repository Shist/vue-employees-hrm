<template>
  <div class="user-skills">
    <v-btn
      variant="text"
      color="var(--color-btn-gray-text)"
      class="user-skills__add-btn"
      @click="handleOpenCreateModal"
    >
      <v-icon class="user-skills__add-icon">mdi-plus</v-icon>
      <span>Add skill</span>
    </v-btn>
    <SkillsCategory
      v-for="(aSkills, sCategory) in skillCategories"
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
        @click="deleteUserSkills"
      >
        <span class="user-skills__deletion-btn-label">Delete</span>
        <span class="user-skills__deletion-btn-num">
          {{ skillsForDeletionAmount }}
        </span>
      </v-btn>
    </div>
  </div>
  <SkillModal
    :isOpen="isModalOpen"
    :oSkillForModal="oSkillForModal"
    @closeModal="handleCloseModal"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import SkillModal from "@/components/user/skills/SkillModal.vue";
import SkillsCategory from "@/components/user/skills/SkillsCategory.vue";
import { useRoute } from "vue-router";
import { useUsersStore } from "@/store/users";
import { IUser } from "@/types/backend-interfaces/user";
import { IProfileSkill } from "@/types/backend-interfaces/user/profile/skill";
import { ISkillCategoriesMap, ICategorySkill } from "@/types/userSkillsUI";

const route = useRoute();

// eslint-disable-next-line
const [section, id, tab] = route.fullPath.slice(1).split("/");

const oSkillForModal = ref<IProfileSkill | null>(null);
const isModalOpen = ref(false);

const skillsForDeletionNames = reactive(new Set<string>());

const aSkillsDeletionState = reactive<boolean[]>([]);

const skillsForDeletionAmount = computed<number>(() =>
  aSkillsDeletionState.reduce((acc, isDeleting) => {
    if (isDeleting) acc++;
    return acc;
  }, 0)
);

const { getUserById } = useUsersStore();

const user = ref<IUser | undefined>();

const skillCategories = computed(() => {
  const resultObj: ISkillCategoriesMap = {};

  user.value?.profile.skills.forEach((skill, index) => {
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

function handleOpenCreateModal() {
  oSkillForModal.value = null;
  isModalOpen.value = true;
}

function handleOpenEditModal(
  _oSkillForModal: IProfileSkill,
  skillName: string,
  skillIndex: number
) {
  if (aSkillsDeletionState[skillIndex]) {
    skillsForDeletionNames.delete(skillName);
    aSkillsDeletionState[skillIndex] = false;
  } else {
    oSkillForModal.value = _oSkillForModal;
    isModalOpen.value = true;
  }
}

function handleCloseModal() {
  isModalOpen.value = false;
}

function handleSetCardForDeletion(skillName: string, skillIndex: number) {
  if (skillsForDeletionNames.has(skillName)) {
    skillsForDeletionNames.delete(skillName);
    aSkillsDeletionState[skillIndex] = false;
  } else {
    skillsForDeletionNames.add(skillName);
    aSkillsDeletionState[skillIndex] = true;
  }
}

getUserById(Number(id))
  .then((userData) => {
    aSkillsDeletionState.splice(
      0,
      0,
      ...new Array(userData?.profile.skills.length).fill(false)
    );
    user.value = userData;
  })
  .catch(() => {
    // todo: show some error while loading user data
  });

function clearUserDeletionSkills() {
  skillsForDeletionNames.clear();

  aSkillsDeletionState.fill(false);
}

function deleteUserSkills() {
  // TODO delete all skills, which names are inside skillsForDeletionNames

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
  row-gap: 32px;
  &__add-btn {
    font-size: 18px;
    line-height: 28px;
    text-transform: none;
    border-radius: 0;
    .user-skills__add-icon {
      font-size: 28px;
    }
  }
  &__delete-btns-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
        rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
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

:deep(.user-skills__add-btn .v-btn__content) {
  column-gap: 16px;
}
:deep(.user-skills__deletion-btn .v-btn__content) {
  column-gap: 12px;
}
</style>
