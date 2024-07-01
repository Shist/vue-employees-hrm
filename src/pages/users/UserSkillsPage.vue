<template>
  <div class="user-skills">
    <v-btn
      variant="text"
      color="var(--color-btn-gray-text)"
      class="user-skills__add-btn"
    >
      <v-icon class="user-skills__add-icon">mdi-plus</v-icon>
      <span>Add skill</span>
    </v-btn>
    <SkillsCategory
      v-for="(aSkills, sCategory) in skillCategories"
      :key="sCategory"
      :category="sCategory.toString()"
      :skills="aSkills"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SkillsCategory from "@/components/user/skills/SkillsCategory.vue";
import { useUsersStore } from "@/store/users";
import IUserData from "@/types/IUserData";
import { ISkillCategoriesMap } from "@/types/ISkillMastery";

const { getUserById } = useUsersStore();

const user = ref<IUserData | undefined>();

getUserById(1)
  .then((userData) => {
    user.value = userData;
  })
  .catch(() => {
    // todo: show some error while loading user data
  });

const skillCategories = computed(() => {
  const resultObj: ISkillCategoriesMap = {};

  user.value?.skills.forEach((skill) => {
    const category = skill.category;

    if (resultObj[category]) {
      resultObj[category].push({
        name: skill.name,
        mastery: skill.mastery,
      });
    } else {
      resultObj[category] = [{ name: skill.name, mastery: skill.mastery }];
    }
  });

  return resultObj;
});
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
}

:deep(.user-skills__add-btn .v-btn__content) {
  column-gap: 16px;
}
</style>
