<template>
  <div class="delete-avatar-modal">
    <v-dialog
      v-model="modalState"
      max-width="600"
      class="delete-avatar-modal__dialog-wrapper"
      scrim="var(--color-modal-overlay)"
      opacity="100%"
    >
      <v-card title="Delete Avatar" class="delete-avatar-modal__card-wrapper">
        <v-btn
          icon="mdi-close"
          class="delete-avatar-modal__cross-btn"
          @click.prevent="closeModal"
        ></v-btn>
        <v-card-item class="delete-avatar-modal__message-wrapper">
          <span> Are you sure you want to delete avatar? </span>
        </v-card-item>
        <v-card-actions>
          <v-btn
            variant="outlined"
            @click="closeModal"
            class="delete-avatar-modal__btn-cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            variant="text"
            @click="makeDeleteOperation"
            class="delete-avatar-modal__btn-confirm"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (event: "closeModal"): void;
  (event: "onDeleteUserAvatar"): void;
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
  emit("onDeleteUserAvatar");

  emit("closeModal");
}

function closeModal() {
  emit("closeModal");
}
</script>

<style lang="scss" scoped>
.delete-avatar-modal {
  &__card-wrapper {
    background-color: var(--color-wrapper-bg);
    .delete-avatar-modal__cross-btn {
      font-family: $font-roboto;
      position: absolute;
      width: 40px;
      height: 40px;
      top: 12px;
      right: 12px;
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .delete-avatar-modal__btn-cancel {
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
    .delete-avatar-modal__btn-confirm {
      padding: 6px;
      max-width: 100px;
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
    }
  }
}

:deep(.delete-avatar-modal__message-wrapper .v-card-item__content) {
  padding-block: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
}
:deep(.v-overlay-container .v-overlay .v-overlay__scrim) {
  display: none;
}
</style>
