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
            <v-list-item @click="() => openProjectDetails(item.id)">
              <v-list-item-title class="project-page__popup-menu-label">
                Project
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="console.log('Update project')" disabled>
              <v-list-item-title class="project-page__popup-menu-label">
                Update project
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="console.log('Delete project')" disabled>
              <v-list-item-title class="project-page__popup-menu-label">
                Delete project
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
  <ProjectsModal />
</template>

<script setup lang="ts">
import { ROUTES } from "@/constants/router";
import { getAllProjects } from "@/services/projects";
import { IProjectsTableData } from "@/types/projectsTableUI";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ProjectsModal from "../components/ProjectsModal.vue";

const router = useRouter();

const search = ref("");

const admin = ref(false);

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

function openProjectDetails(projectId: number) {
  router.push(`${ROUTES.PROJECTS.PATH}/${projectId}`);
}

onMounted(async () => {
  isLoading.value = true;
  const projectData = await getAllProjects();
  console.log(projectData);
  projects.splice(0, projects.length, ...(projectData as []));
  isLoading.value = false;
  console.log(projects);
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
