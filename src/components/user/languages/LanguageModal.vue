<template>
  <div class="language-modal">
    <v-dialog
      v-model="modalState"
      max-width="600"
      class="language-modal__dialog-wrapper"
      scrim="var(--color-modal-overlay)"
      opacity="100%"
    >
      <v-card
        :title="
          !oLanguageForModal
            ? $t('userLanguagesPage.addModalTitle')
            : $t('userLanguagesPage.updateModalTitle')
        "
        class="language-modal__card-wrapper"
      >
        <v-btn
          icon="mdi-close"
          class="language-modal__cross-btn"
          @click.prevent="closeModal"
        ></v-btn>
        <v-card-item class="language-modal__text-fields-container">
          <v-select
            v-model="selectLanguage"
            :items="aLanguagesItems"
            :label="$t('label.language')"
            :loading="areAllLangsLoading"
            :disabled="
              !!oLanguageForModal || areAllLangsLoading || isAllLangsError
            "
            :no-data-text="$t('userLanguagesPage.noLanguagesData')"
            variant="outlined"
            class="language-modal__text-field-wrapper"
            hide-details
          />
          <v-select
            v-model="selectLanguageProficiency"
            :items="aLanguageProficiencies"
            :label="$t('label.languageProficiency')"
            variant="outlined"
            class="language-modal__text-field-wrapper"
            :disabled="!selectLanguage"
            hide-details
          />
        </v-card-item>
        <v-card-actions>
          <v-btn
            variant="outlined"
            @click="closeModal"
            class="language-modal__btn-cancel"
          >
            {{ $t("button.cancelButton") }}
          </v-btn>
          <v-btn
            type="submit"
            variant="text"
            @click="makeCreateOrUpdateOperation"
            class="language-modal__btn-confirm"
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
import { ref, computed, onUpdated } from "vue";
import { useI18n } from "vue-i18n";
import { Proficiency } from "@/types/enums";
import {
  ILanguagesNamesData,
  IProfileLanguage,
  IAddOrUpdateProfileLanguageInput,
} from "@/types/pages/users/languages";

const { t } = useI18n({ useScope: "global" });

const props = defineProps<{
  isOpen: boolean;
  oLanguageForModal: IProfileLanguage | null;
  userId: string;
  userLanguages: IProfileLanguage[] | null;
  allLanguages: ILanguagesNamesData[] | null;
  areAllLangsLoading: boolean;
  isAllLangsError: boolean;
}>();

const leftUserLanguages = computed<ILanguagesNamesData[]>(() => {
  if (!props.userLanguages || !props.allLanguages) {
    return [];
  }

  const userLanguagesSet = new Set(
    props.userLanguages.map((language) => language.name)
  );

  return props.allLanguages.filter(
    (language) => !userLanguagesSet.has(language.name)
  );
});

const emit = defineEmits<{
  (event: "closeModal"): void;
  (
    event: "onCreateUserLanguage",
    languageInputObj: IAddOrUpdateProfileLanguageInput
  ): void;
  (
    event: "onUpdateUserLanguage",
    languageInputObj: IAddOrUpdateProfileLanguageInput
  ): void;
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
    (!props.oLanguageForModal && !selectLanguage.value) ||
    (!!props.oLanguageForModal &&
      selectLanguageProficiency.value === props.oLanguageForModal.proficiency)
);

const aLanguagesItems = computed(() => {
  return leftUserLanguages.value.map((language) => language.name);
});

const aLanguageProficiencies = computed(() => {
  return [
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
    {
      title: t("userLanguagesPage.languageProficiency.Native"),
      value: "Native",
    },
  ];
});

const selectLanguage = ref<string | null>(null);
const selectLanguageProficiency = ref<Proficiency>(Proficiency.A1);

onUpdated(() => {
  selectLanguage.value = props.oLanguageForModal?.name || null;
  selectLanguageProficiency.value =
    props.oLanguageForModal?.proficiency || Proficiency.A1;
});

function makeCreateOrUpdateOperation() {
  const languageInputObj: IAddOrUpdateProfileLanguageInput = {
    userId: Number(props.userId),
    name: `${selectLanguage.value}`,
    proficiency: selectLanguageProficiency.value,
  };

  if (props.oLanguageForModal) {
    emit("onUpdateUserLanguage", languageInputObj);
  } else {
    emit("onCreateUserLanguage", languageInputObj);
  }
  emit("closeModal");
}

function closeModal() {
  emit("closeModal");
}
</script>

<style lang="scss" scoped>
.language-modal {
  &__card-wrapper {
    background-color: var(--color-wrapper-bg);
    .language-modal__cross-btn {
      font-family: $font-roboto;
      position: absolute;
      width: 40px;
      height: 40px;
      top: 12px;
      right: 12px;
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .language-modal__btn-cancel {
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
    .language-modal__btn-confirm {
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

:deep(.language-modal__text-field-wrapper .v-field__outline__start) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.language-modal__text-field-wrapper .v-field__outline__end) {
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
:deep(.language-modal__text-field-wrapper .v-field__outline__notch::before) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::before) {
  border-top: 1px solid var(--color-input-borders);
}
:deep(.language-modal__text-field-wrapper .v-field__outline__notch::after) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::after) {
  border-bottom: 1px solid var(--color-input-borders);
}
:deep(.language-modal__text-field-wrapper .v-field-label) {
  transition: background-color 0.3s;
}
:deep(.v-field--focused .v-field-label) {
  color: var(--color-active-text);
}
:deep(.language-modal__text-fields-container .v-card-item__content) {
  padding-block: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
}
:deep(.v-overlay-container .v-overlay .v-overlay__scrim) {
  display: none;
}
:deep(.language-modal__btn-cancel .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
:deep(.language-modal__btn-confirm .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
</style>
