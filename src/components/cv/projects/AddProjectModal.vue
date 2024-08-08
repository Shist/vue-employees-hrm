<template>
  <div class="add-project-modal">
    <v-dialog
      v-model="modalState"
      max-width="600"
      class="add-project-modal__dialog-wrapper"
      scrim="var(--color-modal-overlay)"
      opacity="100%"
    >
      <v-card
        :title="$t('cvsProjectsPage.addProjectModalTitle')"
        class="add-project-modal__card-wrapper"
      >
        <v-btn
          icon="mdi-close"
          class="add-project-modal__cross-btn"
          @click.prevent="closeModal"
        ></v-btn>
        <v-card-item class="add-project-modal__text-fields-container">
          <v-select
            v-model="selectProject"
            :items="aProjectsItems"
            :label="$t('label.project')"
            variant="outlined"
            class="add-project-modal__text-field-wrapper"
            :loading="areAllProjectsLoading"
            :disabled="areAllProjectsLoading || isAllProjectsError"
            hide-details
          />
        </v-card-item>
        <v-card-actions>
          <v-btn
            variant="outlined"
            @click="closeModal"
            class="add-project-modal__btn-cancel"
          >
            {{ $t("button.cancelButton") }}
          </v-btn>
          <v-btn
            type="submit"
            variant="text"
            @click="makeCreateOperation"
            class="add-project-modal__btn-confirm"
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
import {
  ICvProjectsTableData,
  IProjectsData,
  IAddOrUpdateCvProjectInput,
} from "@/types/pages/cvs/projects";

const props = defineProps<{
  isOpen: boolean;
  cvId: string;
  cvProjects: ICvProjectsTableData[] | null;
  allProjects: IProjectsData[] | null;
  areAllProjectsLoading: boolean;
  isAllProjectsError: boolean;
}>();

const leftCvProjects = computed<IProjectsData[]>(() => {
  if (!props.cvProjects || !props.allProjects) {
    return [];
  }

  const cvProjectsSet = new Set(
    props.cvProjects.map((cvProject) => cvProject.name)
  );

  return props.allProjects.filter(
    (project) => !cvProjectsSet.has(project.name)
  );
});

const emit = defineEmits<{
  (event: "closeModal"): void;
  (
    event: "onCreateCvProject",
    projectInputObj: IAddOrUpdateCvProjectInput
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

const selectProject = ref<IProjectsData | null>(null);

const isConfirmBtnDisabled = computed(() => !selectProject.value);

const aProjectsItems = computed(() => {
  return leftCvProjects.value.map((project) => ({
    title: project.name,
    value: project,
  }));
});

onUpdated(() => {
  selectProject.value = null;
});

function makeCreateOperation() {
  if (!selectProject.value) return;

  const projectInputObj: IAddOrUpdateCvProjectInput = {
    cvId: Number(props.cvId),
    projectId: Number(selectProject.value.id),
    start_date: selectProject.value.startDate,
    end_date: selectProject.value.endDate,
    roles: [],
    responsibilities: [],
  };

  emit("onCreateCvProject", projectInputObj);
  emit("closeModal");
}

function closeModal() {
  emit("closeModal");
}
</script>

<style lang="scss" scoped>
.add-project-modal {
  &__card-wrapper {
    background-color: var(--color-wrapper-bg);
    .add-project-modal__cross-btn {
      font-family: $font-roboto;
      position: absolute;
      width: 40px;
      height: 40px;
      top: 12px;
      right: 12px;
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .add-project-modal__btn-cancel {
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
    .add-project-modal__btn-confirm {
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

:deep(.add-project-modal__text-field-wrapper .v-field__outline__start) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.add-project-modal__text-field-wrapper .v-field__outline__end) {
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
:deep(.add-project-modal__text-field-wrapper .v-field__outline__notch::before) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::before) {
  border-top: 1px solid var(--color-input-borders);
}
:deep(.add-project-modal__text-field-wrapper .v-field__outline__notch::after) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::after) {
  border-bottom: 1px solid var(--color-input-borders);
}
:deep(.add-project-modal__text-field-wrapper .v-field-label) {
  transition: background-color 0.3s;
}
:deep(.v-field--focused .v-field-label) {
  color: var(--color-active-text);
}
:deep(.add-project-modal__text-fields-container .v-card-item__content) {
  padding-block: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
}
:deep(.v-overlay-container .v-overlay .v-overlay__scrim) {
  display: none;
}
:deep(.add-project-modal__btn-cancel .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
:deep(.add-project-modal__btn-confirm .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
</style>
