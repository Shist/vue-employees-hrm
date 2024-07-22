<template>
  <div class="projects-page">
    <AppErrorSection
      v-if="isError"
      :errorMessage="errorMessage"
      class="projects-page__error-wrapper"
    />
    <div v-else class="projects-page__main-content-wrapper">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        single-line
        density="compact"
        placeholder="Search"
        class="projects-page__text-field-wrapper"
      />
      <v-skeleton-loader type="table" :loading="isLoading">
        <v-data-table
          :headers="headers"
          :items="projects"
          :search="search"
          class="projects-page__data-table"
          :custom-filter="handleTableFilter"
        >
          <template v-slot:[`item.options`]>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  v-bind="props"
                  class="projects-page__popup-menu-btn"
                ></v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="projectItem in projectMenuItems"
                  :key="projectItem"
                  disabled
                >
                  <v-list-item-title class="projects-page__popup-menu-label">
                    {{ projectItem }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import useErrorState from "@/composables/useErrorState";
import { getAllProjects } from "@/services/projects";
import { IProjectsTableData } from "@/types/pages/projectsTable";
import { IProjectsFilterFunction } from "@/types/vuetifyDataTable";

const search = ref("");

const projects = reactive<IProjectsTableData[]>([]);

const headers = [
  { key: "name", title: "Name" },
  { key: "internalName", title: "Internal Name" },
  { key: "domain", title: "Domain" },
  { key: "startDate", title: "Start Date" },
  { key: "endDate", title: "End Date" },
  { key: "teamSize", title: "Team Size" },
  { key: "options", sortable: false },
];

const projectMenuItems = ["Project", "Update project", "Delete project"];

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

onMounted(async () => {
  isLoading.value = true;

  try {
    const projectsData = await getAllProjects();

    projects.splice(
      0,
      projects.length,
      ...projectsData.map((project) => ({
        id: project.id,
        name: project.name,
        internalName: project.internal_name,
        domain: project.domain,
        startDate: project.start_date,
        endDate: project.end_date ? project.end_date : "Till now",
        teamSize: project.team_size,
        description: project.description,
      }))
    );

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
});

const handleTableFilter: IProjectsFilterFunction = (value, query, item) => {
  if (!item) return false;
  return (
    item.raw.name.toLowerCase().includes(query.toLowerCase()) ||
    item.raw.internalName.toLowerCase().includes(query.toLowerCase())
  );
};
</script>

<style lang="scss" scoped>
.projects-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__error-wrapper {
    padding-top: 64px;
  }
  &__main-content-wrapper {
    align-self: stretch;
    .projects-page__text-field-wrapper {
      margin-left: 33px;
      max-width: 320px;
    }
    .projects-page__data-table {
      background-color: var(--color-wrapper-bg);
    }
    .projects-page__popup-menu-btn {
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .projects-page__popup-menu-label {
      font-family: $font-roboto;
    }
  }
}
:deep(.projects-page__text-field-wrapper .v-field__outline__start) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.projects-page__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(
    .projects-page__text-field-wrapper .v-field--active .v-field__outline__start
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(
    .projects-page__text-field-wrapper .v-field--active .v-field__outline__end
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
:deep(
    .projects-page__text-field-wrapper
      .v-field--active
      .v-field__prepend-inner
      .v-icon
  ) {
  opacity: 1;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  padding: 12px 16px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  padding: 12px 16px;
}
</style>
