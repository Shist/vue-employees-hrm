<template>
  <div class="skills-wrapper">
    <h3 class="skills-wrapper__category-headline">{{ category }}</h3>
    <div class="skills-wrapper__category-wrapper">
      <div
        v-for="(categorySkill, categorySkillIndex) in categorySkills"
        :key="categorySkill.name"
      >
        <v-card
          variant="text"
          class="skills-wrapper__skill-card"
          :class="{
            'skills-wrapper__skill-card_is-deleting': categorySkill.isDeleting,
          }"
          @click="
            () =>
              handleOpenEditModal(
                {
                  name: categorySkill.name,
                  category: category,
                  mastery: categorySkill.mastery,
                },
                categorySkill.name,
                categorySkill.skillIndex
              )
          "
          @contextmenu.prevent="
            () =>
              handleSetCardForDeletion(
                categorySkill.name,
                categorySkill.skillIndex
              )
          "
        >
          <v-card-item class="skills-wrapper__skill-card-content">
            <v-progress-linear
              v-model="skillsMasteries[categorySkillIndex]"
              :color="getColorByValue(skillsMasteries[categorySkillIndex])"
            />
            <span class="skills-wrapper__skill-label">{{
              categorySkill.name
            }}</span>
          </v-card-item>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { IProfileSkill } from "@/types/backend-interfaces/user/profile/skill";
import { ICategorySkill } from "@/types/userSkillsUI";
import { Mastery } from "@/types/backend-interfaces/skill/mastery";

const props = defineProps<{
  category: string;
  categorySkills: ICategorySkill[];
}>();

const emit = defineEmits<{
  (
    event: "openEditModal",
    skillForModal: IProfileSkill,
    skillName: string,
    skillIndex: number
  ): void;
  (event: "setCardForDeletion", skillName: string, skillIndex: number): void;
}>();

const skillsMasteries = reactive(
  props.categorySkills.map((skill) => {
    switch (skill.mastery) {
      case Mastery.Novice:
        return 20;
      case Mastery.Advanced:
        return 40;
      case Mastery.Competent:
        return 60;
      case Mastery.Proficient:
        return 80;
      case Mastery.Expert:
        return 100;
      default:
        return 0;
    }
  })
);

function handleOpenEditModal(
  skillForModal: IProfileSkill,
  skillName: string,
  skillIndex: number
) {
  emit("openEditModal", skillForModal, skillName, skillIndex);
}

function handleSetCardForDeletion(skillName: string, skillIndex: number) {
  emit("setCardForDeletion", skillName, skillIndex);
}

function getColorByValue(value: number) {
  if (value === 100) {
    return "red-darken-3";
  } else if (value >= 80) {
    return "yellow-darken-3";
  } else if (value >= 60) {
    return "green-lighten-1";
  } else if (value >= 40) {
    return "blue-lighten-1";
  } else if (value >= 20) {
    return "grey-lighten-1";
  } else {
    return "white";
  }
}
</script>

<style lang="scss" scoped>
.skills-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  &__category-headline {
    @include default-text(18px, 24px);
  }
  &__category-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 5px;
    .skills-wrapper__skill-card {
      border-radius: 0;
      border: 2px solid var(--color-wrapper-bg);
      .skills-wrapper__skill-label {
        color: var(--color-btn-gray-text);
        font-size: 18px;
        line-height: 24px;
      }
      &_is-deleting {
        border: 2px solid var(--color-active-borders);
      }
    }
  }
}

:deep(.skills-wrapper__skill-card .v-card-item__content) {
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  align-items: center;
  gap: 16px;
}
</style>
