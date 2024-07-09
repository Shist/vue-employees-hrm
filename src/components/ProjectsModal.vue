<template>
  <div class="projects-modal">
    <v-dialog
      v-model="modalState"
      max-width="800"
      class="projects-modal__dialog-wrapper"
      scrim="var(--color-modal-overlay)"
      opacity="100%"
    >
      <v-card
        :title="
          isUpdateOrCreateModal === 'create'
            ? 'Create project'
            : 'Update project'
        "
        class="projects-modal__card-wrapper"
      >
        <v-btn
          @click="handleModalClose"
          icon="mdi-close"
          class="projects-modal__cross-btn"
        />
        <v-card-item>
          <form class="projects-modal__form">
            <v-text-field
              v-model="formData.name"
              label="Name"
              variant="outlined"
              class="projects-modal__input"
            />
            <v-text-field
              v-model="formData.internal_name"
              label="Internal Name"
              variant="outlined"
              class="projects-modal__input"
            />
            <v-text-field
              v-model="formData.domain"
              label="Domain"
              variant="outlined"
              class="projects-modal__input"
            />
            <v-text-field
              type="number"
              v-model="formData.team_size"
              label="Team Size"
              variant="outlined"
              class="projects-modal__input"
            />
            <v-text-field
              type="date"
              label="Start Date"
              v-model="formData.start_date"
              variant="outlined"
              class="projects-modal__input projects-modal__input-date"
            />
            <v-text-field
              type="date"
              label="End Date"
              v-model="formData.end_date"
              variant="outlined"
              class="projects-modal__input projects-modal__input-date"
            />
            <v-textarea
              label="Description"
              v-model="formData.description"
              variant="outlined"
              density="compact"
              class="projects-modal__textarea"
              hide-details
            />
          </form>
        </v-card-item>
        <v-card-actions>
          <v-btn
            variant="outlined"
            @click="handleModalClose"
            class="projects-modal__btn-cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            variant="text"
            @click="createOrUpdateProject"
            class="projects-modal__btn-confirm"
            :disabled="isConfirmBtnDisabled"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ICreateProjectInput,
  IUpdateProjectInput,
} from "@/types/backend-interfaces/project";
import { IAddOrUpdateProjectModal } from "@/types/projectsTableUI";
import { computed, onUpdated, reactive } from "vue";

const props = defineProps<{
  isOpen: boolean;
  isUpdateOrCreateModal: string;
  oProjectForModal: IAddOrUpdateProjectModal | null;
}>();

const formData = reactive<ICreateProjectInput>({
  name: "",
  internal_name: "",
  description: "",
  domain: "",
  start_date: "",
  end_date: "",
  team_size: 1,
});

const emit = defineEmits<{
  (event: "closeModal"): void;
  (event: "createProject", createProjectObj: ICreateProjectInput): void;
  (event: "updateProject", updateProjectObj: IUpdateProjectInput): void;
}>();

const modalState = computed({
  get() {
    return props.isOpen;
  },
  set() {
    emit("closeModal");
  },
});

function createOrUpdateProject() {
  if (props.isUpdateOrCreateModal === "create") {
    const projectInputObj: ICreateProjectInput = {
      name: formData.name,
      internal_name: formData.internal_name || "",
      description: formData.description,
      domain: formData.domain,
      start_date: formData.start_date,
      end_date: formData.end_date || "",
      team_size: Number(formData.team_size),
    };
    console.log("create project");
    emit("createProject", projectInputObj);
  } else {
    if (!props.oProjectForModal) return;
    const projectInputObj: IUpdateProjectInput = {
      projectId: Number(props.oProjectForModal?.id),
      name: formData.name,
      internal_name: formData.internal_name || "",
      description: formData.description,
      domain: formData.domain,
      start_date: formData.start_date,
      end_date: formData.end_date || "",
      team_size: Number(formData.team_size),
    };
    console.log("update project", projectInputObj);
    emit("updateProject", projectInputObj);
  }

  handleModalClose();
}

function handleModalClose() {
  formData.name = "";
  formData.internal_name = "";
  formData.description = "";
  formData.domain = "";
  formData.start_date = "";
  formData.end_date = "";
  formData.team_size = 1;
  emit("closeModal");
}

const isConfirmBtnDisabled = computed(() => {
  if (
    !props.oProjectForModal &&
    (formData.name === "" ||
      formData.description === "" ||
      formData.domain === "" ||
      formData.start_date === "" ||
      !formData.team_size)
  )
    return true;
  else if (
    (formData.name === props.oProjectForModal?.name &&
      formData.internal_name === props.oProjectForModal?.internalName &&
      formData.description === props.oProjectForModal?.description &&
      formData.domain === props.oProjectForModal?.domain &&
      formData.start_date === props.oProjectForModal?.startDate &&
      (formData.end_date === props.oProjectForModal?.endDate ||
        formData.end_date === "") &&
      Number(formData.team_size) === props.oProjectForModal?.teamSize) ||
    formData.name === "" ||
    formData.description === "" ||
    formData.domain === "" ||
    formData.start_date === "" ||
    !formData.team_size
  ) {
    return true;
  }
  return false;
});

onUpdated(() => {
  if (!props.oProjectForModal) {
    formData.name = "";
    formData.internal_name = "";
    formData.description = "";
    formData.domain = "";
    formData.start_date = "";
    formData.end_date = "";
    formData.team_size = 1;
  } else {
    formData.name = props.oProjectForModal?.name;
    formData.internal_name = props.oProjectForModal?.internalName;
    formData.description = props.oProjectForModal?.description;
    formData.domain = props.oProjectForModal?.domain;
    formData.start_date = props.oProjectForModal?.startDate;
    formData.end_date =
      props.oProjectForModal?.endDate === "Till now"
        ? ""
        : props.oProjectForModal.endDate;
    formData.team_size = props.oProjectForModal?.teamSize;
  }
});
</script>

<style lang="scss" scoped>
.projects-modal {
  &__card-wrapper {
    background-color: var(--color-wrapper-bg);
    .projects-modal__cross-btn {
      font-family: $font-roboto;
      position: absolute;
      width: 40px;
      height: 40px;
      top: 12px;
      right: 12px;
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .projects-modal__form {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 772px;
      padding-top: 8px;
      column-gap: 32px;
      row-gap: 8px;
      border-radius: 0px;
    }
    .projects-modal__input {
      max-width: 360px;
      width: 100%;
    }
    .projects-modal__textarea {
      max-width: 752px;
      width: 100%;
    }
    .projects-modal__btn-cancel {
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
    .projects-modal__btn-confirm {
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
:deep(.projects-modal__input .v-field__outline__start) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.projects-modal__input .v-field__outline__end) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.projects-modal__textarea .v-field__outline__start) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.projects-modal__textarea .v-field__outline__end) {
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
:deep(.projects-modal__input .v-field__outline__notch::before) {
  transition: 0.3s;
}
:deep(.projects-modal__textarea .v-field__outline__notch::before) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::before) {
  border-top: 1px solid var(--color-input-borders);
}
:deep(.projects-modal__input .v-field__outline__notch::after) {
  transition: 0.3s;
}
:deep(.projects-modal__textarea .v-field__outline__notch::after) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::after) {
  border-bottom: 1px solid var(--color-input-borders);
}
:deep(.projects-modal__input .v-field-label) {
  transition: background-color 0.3s;
}
:deep(.projects-modal__textarea .v-field-label) {
  transition: background-color 0.3s;
}
:deep(.v-field--focused .v-field-label) {
  color: var(--color-active-text);
}
:deep(
    .projects-modal__input-date
      .v-field__input::-webkit-calendar-picker-indicator
  ) {
  position: absolute;
  top: 17px;
  right: 13px;
  width: 20px;
  height: 20px;
  color: white;
}
</style>
