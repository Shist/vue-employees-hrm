<template>
  <div class="skill-modal">
    <v-dialog
      v-model="modalState"
      max-width="600"
      theme="dark"
      class="skill-modal__dialog-wrapper"
      scrim="var(--color-modal-overlay)"
      opacity="100%"
    >
      <v-card
        :title="skillForModal ? 'Update skill' : 'Add skill'"
        class="skill-modal__card-wrapper"
      >
        <v-btn
          icon="mdi-close"
          class="skill-modal__cross-btn"
          @click.prevent="handleModalClose"
        ></v-btn>
        <v-card-item class="skill-modal__text-fields-container">
          <v-select
            v-model="selectSkill"
            :items="skillsItems"
            label="Skill"
            variant="outlined"
            class="skill-modal__text-field-wrapper"
            hide-details
            :disabled="!!skillForModal"
          />
          <v-select
            v-model="selectCategory"
            :items="skillCategories"
            label="Category"
            variant="outlined"
            class="skill-modal__text-field-wrapper"
            hide-details
            disabled
          />
          <v-select
            v-model="selectSkillMastery"
            :items="skillMasteries"
            label="Skill mastery"
            variant="outlined"
            class="skill-modal__text-field-wrapper"
            hide-details
            :disabled="!selectSkill"
          />
        </v-card-item>
        <v-card-actions>
          <v-btn
            variant="outlined"
            @click="handleModalClose"
            class="skill-modal__btn-cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            variant="text"
            @click="handleModalClose"
            class="skill-modal__btn-confirm"
            :disabled="
              (!skillForModal && !selectSkill) ||
              (!!skillForModal &&
                selectSkillMastery ===
                  (props.skillForModal?.mastery !== undefined
                    ? skillMasteries[props.skillForModal?.mastery]
                    : skillMasteries[0]))
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUpdated } from "vue";
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

const { skills, skillCategories, getCategoryBySkill } = useSkillsStore();

const skillsItems = computed(() => skills.map((skill) => skill.name));

const skillMasteries = [
  "Novice",
  "Advanced",
  "Completent",
  "Proficient",
  "Expert",
];

const selectSkill = ref<string | null>(null);
const selectCategory = ref<string | null>(null);
const selectSkillMastery = ref<string | null>(skillMasteries[0]);

onUpdated(() => {
  selectSkill.value = props.skillForModal?.name || null;
  selectCategory.value = props.skillForModal?.category || null;
  selectSkillMastery.value =
    props.skillForModal?.mastery !== undefined
      ? skillMasteries[props.skillForModal?.mastery]
      : skillMasteries[0];
});

watch(selectSkill, () => {
  const skillCategory = getCategoryBySkill(`${selectSkill.value}`);
  selectCategory.value = skillCategory ? skillCategory : null;
});
</script>

<style lang="scss" scoped>
.skill-modal {
  &__card-wrapper {
    background-color: var(--color-wrapper-bg);
    .skill-modal__cross-btn {
      font-family: $font-roboto;
      position: absolute;
      width: 40px;
      height: 40px;
      top: 12px;
      right: 12px;
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .skill-modal__btn-cancel {
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
    .skill-modal__btn-confirm {
      padding: 6px;
      max-width: 100px;
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
    }
  }
}

:deep(.skill-modal__text-field-wrapper .v-field__outline__start) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.skill-modal__text-field-wrapper .v-field__outline__end) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__start) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(.v-field--focused .v-field__outline__end) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
:deep(.skill-modal__text-field-wrapper .v-field__outline__notch::before) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::before) {
  border-top: 1px solid var(--color-input-borders);
}
:deep(.skill-modal__text-field-wrapper .v-field__outline__notch::after) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::after) {
  border-bottom: 1px solid var(--color-input-borders);
}
:deep(.skill-modal__text-field-wrapper .v-field-label) {
  transition: background-color 0.3s;
}
:deep(.v-field--focused .v-field-label) {
  color: var(--color-active-text);
}
:deep(.skill-modal__text-fields-container .v-card-item__content) {
  padding-block: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
}
:deep(.v-overlay-container .v-overlay .v-overlay__scrim) {
  display: none;
}
</style>
