<template>
  <div class="projects-page">
    <v-progress-circular
      v-if="isLoading"
      :size="100"
      :width="10"
      color="var(--color-spinner)"
      indeterminate
      class="projects-page__spinner"
    />
    <div v-else-if="isError" class="projects-page__error-wrapper">
      <h4 class="projects-page__error-message">❌ {{ errorMessage }}</h4>
      <v-btn
        v-if="isNotFoundError"
        class="projects-page__back-to-main-btn"
        router
        :to="ROUTES.USERS.PATH"
      >
        Back to the main page
      </v-btn>
      <span v-if="!isNotFoundError" class="projects-page__try-to-reload-label">
        Please try to reload the page
      </span>
    </div>
    <div class="projects-page__main-content-wrapper" v-else>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        single-line
        density="compact"
        placeholder="Search"
        class="projects-page__text-field-wrapper"
      />
      <v-data-table
        :headers="headers"
        :items="projects"
        :search="search"
        :class="{ 'projects-page__data-table': true }"
        item-key="name"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllProjects } from "@/services/projects";
import { IProjectsTableData } from "@/types/projectsTableUI";
import { onMounted, reactive, ref } from "vue";
import { ROUTES } from "@/constants/router";
import useErrorState from "@/composables/useErrorState";

const search = ref("");

const headers = [
  { key: "name", title: "Name" },
  { key: "internalName", title: "Internal Name" },
  { key: "domain", title: "Domain" },
  { key: "startDate", title: "Start Date" },
  { key: "endDate", title: "End Date" },
  { key: "teamSize", title: "Team Size" },
  { key: "options", sortable: false },
];

const {
  isLoading,
  isError,
  errorMessage,
  isNotFoundError,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const projectMenuItems = ["Project", "Update project", "Delete project"];

const projects = reactive<IProjectsTableData[]>([]);

onMounted(async () => {
  isLoading.value = true;
  try {
    const projectData = await getAllProjects();
    projects.splice(0, projects.length, ...projectData);
    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.projects-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__spinner {
    margin-top: 64px;
  }
  &__error-wrapper {
    padding-top: 64px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    .projects-page__error-message {
      @include default-text(26px, 32px);
    }
    .projects-page__back-to-main-btn {
      color: var(--color-btn-text);
      background-color: var(--color-btn-bg);
      border-radius: 0;
      &:hover {
        background-color: var(--color-btn-bg-hover);
      }
    }
    .projects-page__try-to-reload-label {
      @include default-text(20px, 26px);
    }
  }
  &__main-content-wrapper {
    align-self: stretch;
    .projects-page__text-field-wrapper {
      margin-left: 20px;
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
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  padding: 12px 16px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  padding: 12px 16px;
}
</style>
