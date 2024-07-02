<template>
  <div class="skill-modal">
    <v-dialog v-model="modalState" max-width="600">
      <v-card :title="skillForModal ? 'Update skill' : 'Add skill'">
        <v-card-item class="skills-wrapper__skill-card-content">
          <v-select
            v-model="selectSkill"
            :items="skills.map((skill) => skill.name)"
            label="Skill"
            variant="outlined"
            class="user-info__text-field-wrapper"
          ></v-select>
          <v-select
            v-model="selectCategory"
            :items="skillCategories"
            label="Category"
            variant="outlined"
            class="user-info__text-field-wrapper"
          ></v-select>
          <v-select
            v-model="selectSkillMastery"
            :items="skillMasteries"
            label="Skill mastery"
            variant="outlined"
            class="user-info__text-field-wrapper"
          ></v-select>
        </v-card-item>
        <v-card-actions>
          <v-btn text="Close" variant="text" @click="handleModalClose"></v-btn>
          <v-btn
            color="primary"
            text="Save"
            variant="text"
            @click="handleModalClose"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useSkillsStore } from "@/store/skills";
import { ISkillForModal } from "@/types/ISkill";

const props = defineProps<{
  isOpen: boolean;
  skillForModal: ISkillForModal | null;
}>();

const emit = defineEmits<{ (event: "closeModal"): void }>();
function handleModalClose() {
  emit("closeModal");
}

const modalState = computed({
  get() {
    return props.isOpen;
  },
  set() {
    emit("closeModal");
  },
});

const { skills, skillCategories } = useSkillsStore();

const selectSkill = ref<string | null>(null);
const selectCategory = ref<string | null>(null);
const selectSkillMastery = ref<string | null>(null);

watchEffect(() => {
  selectSkill.value = props.skillForModal?.name || null;
  selectCategory.value = props.skillForModal?.category || null;
  selectSkillMastery.value =
    props.skillForModal?.mastery !== undefined
      ? skillMasteries[props.skillForModal?.mastery]
      : null;
});

const skillMasteries = [
  "Novice",
  "Advanced",
  "Completent",
  "Proficient",
  "Expert",
];
</script>

<style lang="scss" scoped></style>
