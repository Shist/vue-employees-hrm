<template>
  <div class="create-cv-modal">
    <v-dialog
      v-model="modalState"
      max-width="600"
      class="create-cv-modal__dialog-wrapper"
      scrim="var(--color-modal-overlay)"
      opacity="100%"
    >
      <v-card
        :title="$t('cvsPage.createModalTitle')"
        class="create-cv-modal__card-wrapper"
      >
        <v-btn
          icon="mdi-close"
          class="create-cv-modal__cross-btn"
          @click.prevent="closeModal"
        ></v-btn>
        <v-card-item class="create-cv-modal__text-fields-container">
          <v-text-field
            v-model="cvName"
            :label="$t('label.name')"
            variant="outlined"
            class="create-cv-modal__text-field-wrapper"
            hide-details
          />
          <v-text-field
            v-model="cvEducation"
            :label="$t('label.education')"
            variant="outlined"
            class="create-cv-modal__text-field-wrapper"
            hide-details
          />
          <v-textarea
            v-model="cvDescription"
            :label="$t('label.description')"
            variant="outlined"
            class="create-cv-modal__text-field-wrapper"
            no-resize
            hide-details
          />
        </v-card-item>
        <v-card-actions>
          <v-btn
            variant="outlined"
            @click="closeModal"
            class="create-cv-modal__btn-cancel"
          >
            {{ $t("button.cancelButton") }}
          </v-btn>
          <v-btn
            type="submit"
            variant="text"
            @click="makeCreateOperation"
            class="create-cv-modal__btn-confirm"
            :disabled="isConfirmBtnDisabled"
          >
            {{ $t("button.createButton") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUpdated } from "vue";
import { ICreateCvInput } from "@/types/cvsOperations";

const props = defineProps<{
  isOpen: boolean;
  userId: string;
}>();

const emit = defineEmits<{
  (event: "closeModal"): void;
  (event: "onCreateUserCv", cvInputObj: ICreateCvInput): void;
}>();

const modalState = computed({
  get() {
    return props.isOpen;
  },
  set() {
    emit("closeModal");
  },
});

const cvName = ref<string | null>(null);
const cvEducation = ref<string | null>(null);
const cvDescription = ref<string | null>(null);

const isConfirmBtnDisabled = computed(
  () => !cvName.value || !cvDescription.value
);

onUpdated(() => {
  cvName.value = null;
  cvEducation.value = null;
  cvDescription.value = null;
});

function makeCreateOperation() {
  const cvInputObj: ICreateCvInput = {
    name: `${cvName.value}`,
    education: cvEducation.value,
    description: `${cvDescription.value}`,
    userId: Number(props.userId),
  };

  emit("onCreateUserCv", cvInputObj);

  emit("closeModal");
}

function closeModal() {
  emit("closeModal");
}
</script>

<style lang="scss" scoped>
.create-cv-modal {
  &__card-wrapper {
    background-color: var(--color-wrapper-bg);
    .create-cv-modal__cross-btn {
      font-family: $font-roboto;
      position: absolute;
      width: 40px;
      height: 40px;
      top: 12px;
      right: 12px;
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .create-cv-modal__btn-cancel {
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
    .create-cv-modal__btn-confirm {
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

:deep(.create-cv-modal__text-field-wrapper .v-field__outline__start) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.create-cv-modal__text-field-wrapper .v-field__outline__end) {
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
:deep(.create-cv-modal__text-field-wrapper .v-field__outline__notch::before) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::before) {
  border-top: 1px solid var(--color-input-borders);
}
:deep(.create-cv-modal__text-field-wrapper .v-field__outline__notch::after) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::after) {
  border-bottom: 1px solid var(--color-input-borders);
}
:deep(.create-cv-modal__text-field-wrapper .v-field-label) {
  transition: background-color 0.3s;
}
:deep(.v-field--focused .v-field-label) {
  color: var(--color-active-text);
}
:deep(.create-cv-modal__text-fields-container .v-card-item__content) {
  padding-block: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
}
:deep(.v-overlay-container .v-overlay .v-overlay__scrim) {
  display: none;
}
:deep(.create-cv-modal__btn-cancel .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
:deep(.create-cv-modal__btn-confirm .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
</style>
