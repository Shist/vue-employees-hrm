<template>
  <div class="projects-page">
    <AppErrorSection
      v-if="isError"
      :errorMessageKey="errorMessageKey"
      class="projects-page__error-wrapper"
    />
    <div v-else class="projects-page__main-content-wrapper">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        single-line
        density="compact"
        :placeholder="$t('placeholder.search')"
        class="projects-page__text-field-wrapper"
        hide-details
      />
      <v-skeleton-loader type="table" :loading="isLoading">
        <v-data-table
          :headers="headers"
          :items="projects"
          :search="search"
          :custom-filter="handleTableFilter"
          :mobile="null"
          :mobile-breakpoint="1070"
          :no-data-text="$t('projectsPage.noProjects')"
          class="projects-page__data-table"
          hide-details
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
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import useErrorState from "@/composables/useErrorState";
import { getAllProjects } from "@/services/projects";
import { IProjectsTableData } from "@/types/pages/projectsTable";
import { IProjectsFilterFunction } from "@/types/vuetifyDataTable";

const { t } = useI18n({ useScope: "global" });

const search = ref("");

const projects = reactive<IProjectsTableData[]>([]);

const headers = computed(() => {
  return [
    { key: "name", title: t(`projectsPage.name`) },
    { key: "internalName", title: t(`projectsPage.internalName`) },
    { key: "domain", title: t(`projectsPage.domain`) },
    { key: "startDate", title: t(`projectsPage.startDate`) },
    { key: "endDate", title: t(`projectsPage.endDate`) },
    { key: "teamSize", title: t(`projectsPage.teamSize`) },
    { key: "options", sortable: false },
  ];
});

const projectMenuItems = computed(() => {
  return [
    t(`projectsPage.project`),
    t(`projectsPage.updateProject`),
    t(`projectsPage.removeProject`),
  ];
});

const {
  isLoading,
  isError,
  errorMessageKey,
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
      margin-bottom: 22px;
      max-width: 320px;
      @media (max-width: $tablet-l) {
        margin-bottom: 10px;
      }
      @media (max-width: $phone-l) {
        margin-inline: 10px;
        margin-bottom: 5px;
        max-width: 100%;
      }
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
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(1)),
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(2)),
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(3)) {
  max-width: 200px;
  @media (max-width: 1069px) {
    max-width: none;
  }
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 80px;
  @media (max-width: 1069px) {
    width: 100%;
  }
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td)
  > .v-data-table__td-value {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
