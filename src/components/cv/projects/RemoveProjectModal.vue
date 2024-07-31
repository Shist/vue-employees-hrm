<template>
  <div class="remove-project-modal">
    <v-dialog
      v-model="modalState"
      max-width="600"
      class="remove-project-modal__dialog-wrapper"
      scrim="var(--color-modal-overlay)"
      opacity="100%"
    >
      <v-card
        :title="$t('cvsProjectsPage.removeProjectModalTitle')"
        class="remove-project-modal__card-wrapper"
      >
        <v-btn
          icon="mdi-close"
          class="remove-project-modal__cross-btn"
          @click.prevent="closeModal"
        ></v-btn>
        <v-card-item class="remove-project-modal__message-wrapper">
          <i18n-t
            scope="global"
            keypath="cvsProjectsPage.removeProjectModalText"
            tag="span"
          >
            <template v-slot:projectName>
              <b>{{ projectName }}</b>
            </template>
          </i18n-t>
        </v-card-item>
        <v-card-actions>
          <v-btn
            variant="outlined"
            @click="closeModal"
            class="remove-project-modal__btn-cancel"
          >
            {{ $t("button.cancelButton") }}
          </v-btn>
          <v-btn
            type="submit"
            variant="text"
            @click="makeDeleteOperation"
            class="remove-project-modal__btn-confirm"
          >
            {{ $t("button.confirmButton") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IRemoveCvProjectInput } from "@/types/pages/cvs/projects";

const props = defineProps<{
  isOpen: boolean;
  cvId: string | null;
  projectId: string | null;
  projectName: string | null;
}>();

const emit = defineEmits<{
  (event: "closeModal"): void;
  (event: "onRemoveCvProject", projectInputObj: IRemoveCvProjectInput): void;
}>();

const modalState = computed({
  get() {
    return props.isOpen;
  },
  set() {
    emit("closeModal");
  },
});

function makeDeleteOperation() {
  if (!props.cvId) return;

  const projectInputObj: IRemoveCvProjectInput = {
    cvId: Number(props.cvId),
    projectId: Number(props.projectId),
  };

  emit("onRemoveCvProject", projectInputObj);
  emit("closeModal");
}

function closeModal() {
  emit("closeModal");
}
</script>

<style lang="scss" scoped>
.remove-project-modal {
  &__card-wrapper {
    background-color: var(--color-wrapper-bg);
    .remove-project-modal__cross-btn {
      font-family: $font-roboto;
      position: absolute;
      width: 40px;
      height: 40px;
      top: 12px;
      right: 12px;
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .remove-project-modal__btn-cancel {
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
    .remove-project-modal__btn-confirm {
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

:deep(.remove-project-modal__message-wrapper .v-card-item__content) {
  padding-block: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
}
:deep(.v-overlay-container .v-overlay .v-overlay__scrim) {
  display: none;
}
:deep(.remove-project-modal__btn-cancel .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
:deep(.remove-project-modal__btn-confirm .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
</style>
