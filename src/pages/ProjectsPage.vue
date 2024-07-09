<template>
  <div class="project-page" v-if="!isLoading">
    <div class="project-page__wrapper">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        single-line
        density="compact"
        placeholder="Search"
        class="project-page__text-field-wrapper"
      />
      <v-btn
        v-if="admin"
        rounded
        prepend-icon="mdi-plus"
        color="var(--color-wrapper-bg)"
        elevation="0"
        class="text-red-darken-4 project-page__button mr-8"
        @click="openCreateProjectModal()"
        >CREATE PROJECT</v-btn
      >
    </div>

    <v-data-table
      :headers="headers"
      :items="projects"
      :search="search"
      :class="{ 'project-page__data-table': true }"
      item-key="name"
    >
      <template v-slot:[`item.options`]="{ item }">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              v-bind="props"
              class="project-page__popup-menu-btn"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item @click="() => openProjectDetails(item.id)" disabled>
              <v-list-item-title class="project-page__popup-menu-label">
                Project
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="() => openUpdateProjectModal(item)">
              <v-list-item-title class="project-page__popup-menu-label">
                Update project
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="() => onDeleteProject(item.id)">
              <v-list-item-title class="project-page__popup-menu-label">
                Delete project
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
  <ProjectsModal
    :isOpen="isModalOpen"
    @closeModal="handleCloseModal"
    @createProject="onCreateProject"
    @updateProject="onUpdateProject"
    :isUpdateOrCreateModal="modalStatus"
    :oProjectForModal="oProjectForModal"
  />
</template>

<script setup lang="ts">
import { ROUTES } from "@/constants/router";
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "@/services/projects";
import {
  IProjectsTableData,
  IAddOrUpdateProjectModal,
} from "@/types/projectsTableUI";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ProjectsModal from "../components/ProjectsModal.vue";
import {
  ICreateProjectInput,
  IUpdateProjectInput,
} from "@/types/backend-interfaces/project";

const router = useRouter();

const search = ref("");

const admin = ref(true);
const isModalOpen = ref(false);
const modalStatus = ref<string>("");

const headers = reactive([
  { key: "name", title: "Name" },
  { key: "internalName", title: "Internal Name" },
  { key: "domain", title: "Domain" },
  { key: "startDate", title: "Start Date" },
  { key: "endDate", title: "End Date" },
  { key: "teamSize", title: "Team Size" },
  { key: "options", sortable: false },
]);

const projects = reactive<IProjectsTableData[]>([]);

const isLoading = ref<boolean>(false);

const oProjectForModal = ref<IAddOrUpdateProjectModal | null>(null);

function openProjectDetails(projectId: number) {
  router.push(`${ROUTES.PROJECTS.PATH}/${projectId}`);
}

function openCreateProjectModal() {
  oProjectForModal.value = null;
  modalStatus.value = "create";
  isModalOpen.value = true;
}

function openUpdateProjectModal(item: IAddOrUpdateProjectModal) {
  oProjectForModal.value = item;
  modalStatus.value = "update";
  isModalOpen.value = true;
}

async function onCreateProject(projectInputObj: ICreateProjectInput) {
  isLoading.value = true;
  await createProject(projectInputObj);
  const projectData = await getAllProjects();
  projects.splice(0, projects.length, ...(projectData as []));
  isLoading.value = false;
}

async function onUpdateProject(projectInputObj: IUpdateProjectInput) {
  isLoading.value = true;
  await updateProject(projectInputObj);
  const projectData = await getAllProjects();
  projects.splice(0, projects.length, ...(projectData as []));
  isLoading.value = false;
}

async function onDeleteProject(id: number) {
  isLoading.value = true;
  await deleteProject(id);
  const projectData = await getAllProjects();
  projects.splice(0, projects.length, ...(projectData as []));
  isLoading.value = false;
}

function handleCloseModal() {
  isModalOpen.value = false;
}

onMounted(async () => {
  isLoading.value = true;
  const projectData = await getAllProjects();
  projects.splice(0, projects.length, ...(projectData as []));
  isLoading.value = false;
});
</script>

<style lang="scss" scoped>
.project-page {
  &__text-field-wrapper {
    margin-left: 20px;
    max-width: 320px;
  }
  &__wrapper {
    display: flex;
    justify-content: space-between;
  }
  &__button {
    border: 1px solid var(--color-text-red);
  }
  &__data-table {
    background-color: var(--color-wrapper-bg);
  }
  &__popup-menu-btn {
    background-color: var(--color-wrapper-bg);
    box-shadow: none;
  }
  &__popup-menu-label {
    font-family: $font-roboto;
  }
}

:deep(.project-page__text-field-wrapper .v-field__outline__start) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.project-page__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(
    .project-page__text-field-wrapper .v-field--active .v-field__outline__start
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(
    .project-page__text-field-wrapper .v-field--active .v-field__outline__end
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
</style>
