<template>
  <div class="skills-wrapper">
    <h3 class="skills-wrapper__category-headline">{{ props.category }}</h3>
    <div class="skills-wrapper__category-wrapper">
      <div v-for="(skill, skillIndex) in props.skills" :key="skill.name">
        <v-card
          variant="text"
          class="skills-wrapper__skill-card"
          @click="
            () =>
              handleOpenEditModal({
                name: skill.name,
                category: props.category,
                mastery: skill.mastery,
              })
          "
        >
          <v-card-item class="skills-wrapper__skill-card-content">
            <v-progress-linear
              v-model="skillsMasteries[skillIndex]"
              :color="getColorByValue(skillsMasteries[skillIndex])"
            />
            <span class="skills-wrapper__skill-label">{{ skill.name }}</span>
          </v-card-item>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { ISkillMastery, Mastery } from "@/types/ISkillMastery";
import { ISkillForModal } from "@/types/ISkill";

const props = defineProps<{
  category: string;
  skills: Omit<ISkillMastery, "category">[];
}>();

const emit = defineEmits<{
  (event: "openEditModal", skillForModal: ISkillForModal): void;
}>();

function handleOpenEditModal(skillForModal: ISkillForModal) {
  emit("openEditModal", skillForModal);
}

const skillsMasteries = reactive(
  props.skills.map((skill) => {
    switch (skill.mastery) {
      case Mastery.Novice:
        return 20;
      case Mastery.Advanced:
        return 40;
      case Mastery.Completent:
        return 60;
      case Mastery.Proficient:
        return 80;
      case Mastery.Expert:
        return 100;
    }
  })
);

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
      .skills-wrapper__skill-label {
        color: var(--color-btn-gray-text);
        font-size: 18px;
        line-height: 24px;
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
