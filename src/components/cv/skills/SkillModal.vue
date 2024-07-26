<template>
  <div class="skill-modal">
    <v-dialog
      v-model="modalState"
      max-width="600"
      class="skill-modal__dialog-wrapper"
      scrim="var(--color-modal-overlay)"
      opacity="100%"
    >
      <v-card
        :title="
          !oSkillForModal
            ? $t('userSkillsPage.addModalTitle')
            : $t('userSkillsPage.updateModalTitle')
        "
        class="skill-modal__card-wrapper"
      >
        <v-btn
          icon="mdi-close"
          class="skill-modal__cross-btn"
          @click.prevent="closeModal"
        ></v-btn>
        <v-card-item class="skill-modal__text-fields-container">
          <v-select
            v-model="selectSkill"
            :items="aSkillsItems"
            :label="$t('label.skill')"
            :loading="areAllSkillsLoading"
            :no-data-text="$t('userSkillsPage.noCategoriesMsg')"
            variant="outlined"
            class="skill-modal__text-field-wrapper"
            hide-details
            :disabled="
              !!oSkillForModal || areAllSkillsLoading || isAllSkillsError
            "
          />
          <v-select
            v-model="selectCategory"
            :items="aSkillCategoriesItems"
            :label="$t('label.category')"
            variant="outlined"
            class="skill-modal__text-field-wrapper"
            hide-details
            disabled
          />
          <v-select
            v-model="selectSkillMastery"
            :items="aSkillMasteries"
            :label="$t('label.skillMastery')"
            variant="outlined"
            class="skill-modal__text-field-wrapper"
            hide-details
            :disabled="!selectSkill"
          />
        </v-card-item>
        <v-card-actions>
          <v-btn
            variant="outlined"
            @click="closeModal"
            class="skill-modal__btn-cancel"
          >
            {{ $t("button.cancelButton") }}
          </v-btn>
          <v-btn
            type="submit"
            variant="text"
            @click="makeCreateOrUpdateOperation"
            class="skill-modal__btn-confirm"
            :disabled="isConfirmBtnDisabled"
          >
            {{ $t("button.confirmButton") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUpdated } from "vue";
import { useI18n } from "vue-i18n";
import { Mastery } from "@/types/enums";
import { ISkill, ISkillsData } from "@/types/skillsStructures";
import { IAddOrUpdateCvSkillInput } from "@/types/pages/cvs/skills";
import handleCategoryNames from "@/utils/handleCategoryName";

const { t } = useI18n({ useScope: "global" });

const props = defineProps<{
  isOpen: boolean;
  oSkillForModal: ISkill | null;
  cvId: string;
  cvSkills: ISkill[] | null;
  allSkills: ISkillsData[] | null;
  areAllSkillsLoading: boolean;
  isAllSkillsError: boolean;
}>();

const leftCvSkills = computed<ISkillsData[]>(() => {
  if (!props.cvSkills || !props.allSkills) {
    return [];
  }

  const cvSkillsSet = new Set(props.cvSkills.map((skill) => skill.name));

  return props.allSkills.filter((skill) => !cvSkillsSet.has(skill.name));
});

const emit = defineEmits<{
  (event: "closeModal"): void;
  (event: "onCreateCvSkill", skillInputObj: IAddOrUpdateCvSkillInput): void;
  (event: "onUpdateCvSkill", skillInputObj: IAddOrUpdateCvSkillInput): void;
}>();

const modalState = computed({
  get() {
    return props.isOpen;
  },
  set() {
    emit("closeModal");
  },
});

const isConfirmBtnDisabled = computed(
  () =>
    (!props.oSkillForModal && !selectSkill.value) ||
    (!!props.oSkillForModal &&
      selectSkillMastery.value === props.oSkillForModal.mastery)
);

function getCategoryBySkill(skillName: string) {
  if (!props.allSkills) {
    return props.oSkillForModal?.category;
  } else {
    return props.allSkills.find((skill) => skill.name === skillName)?.category;
  }
}

const aSkillsItems = computed(() => {
  return leftCvSkills.value.map((skill) => skill.name);
});

const aSkillCategoriesItems = computed(() => {
  if (!props.allSkills) return [];
  const categoriesSet = new Set(props.allSkills.map((skill) => skill.category));
  return [...categoriesSet];
});

const aSkillMasteries = computed(() => {
  return [
    { title: t("userSkillsPage.skillMasteries.Novice"), value: "Novice" },
    { title: t("userSkillsPage.skillMasteries.Advanced"), value: "Advanced" },
    { title: t("userSkillsPage.skillMasteries.Competent"), value: "Competent" },
    {
      title: t("userSkillsPage.skillMasteries.Proficient"),
      value: "Proficient",
    },
    { title: t("userSkillsPage.skillMasteries.Expert"), value: "Expert" },
  ];
});

const selectSkill = ref<string | null>(null);
const selectCategory = ref<string | null>(null);
const selectSkillMastery = ref<Mastery | string>(
  t(`userSkillsPage.skillMasteries.${Mastery.Novice}`)
);

onUpdated(() => {
  selectSkill.value = props.oSkillForModal?.name || null;
  selectCategory.value = props.oSkillForModal?.category || null;
  selectSkillMastery.value = props.oSkillForModal?.mastery || Mastery.Novice;
});

watch(selectSkill, () => {
  const skillCategory = getCategoryBySkill(`${selectSkill.value}`);
  selectCategory.value = skillCategory
    ? t(`userSkillsPage.skillCategories.${skillCategory}`)
    : null;
});

function makeCreateOrUpdateOperation() {
  const translatedCategory = handleCategoryNames(selectCategory.value);

  const skillInputObj: IAddOrUpdateCvSkillInput = {
    cvId: Number(props.cvId),
    name: `${selectSkill.value}`,
    category: translatedCategory,
    mastery: selectSkillMastery.value,
  };

  if (props.oSkillForModal) {
    emit("onUpdateCvSkill", skillInputObj);
  } else {
    emit("onCreateCvSkill", skillInputObj);
  }
  emit("closeModal");
}

function closeModal() {
  emit("closeModal");
}
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
    .skill-modal__btn-confirm {
      padding: 6px;
      max-width: 150px;
      width: 100%;
      color: var(--color-btn-text);
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
      @media (max-width: $phone-l) {
        max-width: 100px;
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
:deep(.skill-modal__btn-cancel .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
:deep(.skill-modal__btn-confirm .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
</style>
