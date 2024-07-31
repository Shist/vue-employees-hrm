<template>
  <div class="cv-projects">
    <AppErrorSection
      v-if="isCvProjectsError"
      :errorMessageKey="cvProjectsErrorMessage"
      class="cv-projects__error-wrapper"
    />
    <div v-else class="cv-projects__main-content-wrapper">
      <div class="cv-projects__search-create-controls-wrapper">
        <v-text-field
          v-model="search"
          :placeholder="$t('placeholder.search')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          single-line
          class="cv-projects__text-field-wrapper"
          hide-details
        />
        <v-btn
          v-if="isOwner"
          rounded
          prepend-icon="mdi-plus"
          color="var(--color-wrapper-bg)"
          elevation="0"
          class="cv-projects__button text-red-darken-4"
          @click="handleOpenCreateModal"
          :loading="areCvProjectsLoading"
        >
          {{ $t("cvsProjectsPage.btnAdd") }}
        </v-btn>
      </div>
      <v-skeleton-loader type="table" :loading="areCvProjectsLoading">
        <v-data-table
          :headers="headers"
          :items="cvProjects"
          :search="search"
          :custom-filter="handleTableFilter"
          :mobile="null"
          :mobile-breakpoint="1000"
          :no-data-text="$t('projectsPage.noProjects')"
          class="cv-projects__data-table"
          hide-details
        >
          <template v-slot:[`item.options`]="{ item }">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  v-bind="props"
                  class="cv-projects__popup-menu-btn"
                />
              </template>
              <v-list>
                <v-list-item
                  v-for="projectItem in projectMenuItems"
                  :key="projectItem.title"
                  :disabled="projectItem.disabled"
                  v-on:click="
                    projectItem.click
                      ? projectItem.click(item.projectId, item.name)
                      : null
                  "
                >
                  <v-list-item-title class="cv-projects__popup-menu-label">
                    {{ projectItem.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </div>
  </div>
  <AddProjectModal
    :isOpen="isCreateModalOpen"
    :cvId="cvId"
    :cvProjects="cvProjects"
    :allProjects="allProjects"
    :areAllProjectsLoading="areAllProjectsLoading"
    :isAllProjectsError="isAllProjectsError"
    @onCreateCvProject="submitCvProjectAdding"
    @closeModal="handleCloseCreateModal"
  />
  <RemoveProjectModal
    :isOpen="isDeleteModalOpen"
    :cvId="cvId"
    :projectId="addingProjectId"
    :projectName="addingProjectName"
    @onRemoveCvProject="submitCvProjectRemoving"
    @closeModal="handleCloseDeleteModal"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "vue-i18n";
import AddProjectModal from "@/components/cv/projects/AddProjectModal.vue";
import RemoveProjectModal from "@/components/cv/projects/RemoveProjectModal.vue";
import useToast from "@/composables/useToast";
import useErrorState from "@/composables/useErrorState";
import {
  getCvProjectsById,
  createCvProject,
  deleteCvProject,
} from "@/services/cvs/projects";
import { getAllProjectsData } from "@/services/projects";
import handleScrollPadding from "@/utils/handleScrollPadding";
import {
  ICvProjectsTableData,
  ICvProjectsTableServerData,
  IProjectsData,
  IAddOrUpdateCvProjectInput,
  IRemoveCvProjectInput,
} from "@/types/pages/cvs/projects";
import { ICvProjectsFilterFunction } from "@/types/vuetifyDataTable";

const { t } = useI18n({ useScope: "global" });

const route = useRoute();

const cvId = computed<string>(() => {
  // eslint-disable-next-line
  const [section, cvId, tab] = route.fullPath.slice(1).split("/");
  return cvId;
});

const cvUserId = ref<string | null>(null);

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === cvUserId.value);

const addingProjectId = ref<string | null>(null);
const addingProjectName = ref<string | null>(null);

const search = ref("");

const headers = computed(() => {
  return [
    { key: "name", title: t(`projectsPage.name`) },
    {
      key: "internalName",
      title: t(`projectsPage.internalName`),
      sortable: false,
    },
    { key: "domain", title: t(`projectsPage.domain`), sortable: false },
    { key: "startDate", title: t(`projectsPage.startDate`), sortable: false },
    { key: "endDate", title: t(`projectsPage.endDate`), sortable: false },
    { key: "options", sortable: false },
  ];
});

const projectMenuItems = computed(() => {
  return [
    { title: t(`projectsPage.project`), disabled: true },
    { title: t(`projectsPage.updateProject`), disabled: true },
    {
      title: t(`projectsPage.removeProject`),
      disabled: !isOwner.value,
      click: handleOpenDeleteModal,
    },
  ];
});

const { setErrorToast } = useToast();

const {
  isLoading: areCvProjectsLoading,
  isError: isCvProjectsError,
  errorMessageKey: cvProjectsErrorMessage,
  setErrorValuesToDefault: setCvProjectsErrorValuesToDefault,
  setErrorValues: setCvProjectsErrorValues,
} = useErrorState();

const {
  isLoading: areAllProjectsLoading,
  isError: isAllProjectsError,
  setErrorValuesToDefault: setAllProjectsErrorValuesToDefault,
  setErrorValues: setAllProjectsErrorValues,
} = useErrorState();

const cvProjects = reactive<ICvProjectsTableData[]>([]);
const allProjects = reactive<IProjectsData[]>([]);

const isCreateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

onMounted(() => {
  fetchData();
});

watch(isCreateModalOpen, (newValue) => {
  handleScrollPadding(newValue);
});

watch(isDeleteModalOpen, (newValue) => {
  handleScrollPadding(newValue);
});

function updateCvProjectsValue(
  cvProjectsServerData: ICvProjectsTableServerData
) {
  if (!cvProjectsServerData.projects || !cvProjectsServerData.user) return;

  const cvProjectsTableData: ICvProjectsTableData[] =
    cvProjectsServerData.projects.map((projectFromServer) => ({
      projectId: `${projectFromServer.project.id}`,
      name: projectFromServer.name,
      internalName: projectFromServer.internal_name,
      domain: projectFromServer.domain,
      startDate: projectFromServer.start_date,
      endDate: projectFromServer.end_date,
    }));

  cvProjects.splice(0, cvProjects.length, ...cvProjectsTableData);

  cvUserId.value = cvProjectsServerData.user.id;
}

async function fetchCvProjects() {
  areCvProjectsLoading.value = true;

  try {
    const cvProjectsServerData = await getCvProjectsById(cvId.value);

    updateCvProjectsValue(cvProjectsServerData);

    setCvProjectsErrorValuesToDefault();
  } catch (error: unknown) {
    setCvProjectsErrorValues(error);
  } finally {
    areCvProjectsLoading.value = false;
  }
}

async function fetchAllProjectsCvData() {
  areAllProjectsLoading.value = true;

  try {
    const allProjectsServerData = await getAllProjectsData();

    allProjects.splice(
      0,
      allProjects.length,
      ...allProjectsServerData.map((projectServerData) => ({
        id: projectServerData.id,
        name: projectServerData.name,
        startDate: projectServerData.start_date,
        endDate: projectServerData.end_date,
      }))
    );

    setAllProjectsErrorValuesToDefault();
  } catch (error: unknown) {
    setAllProjectsErrorValues(error);

    setErrorToast(t("errors.FAILED_TO_LOAD_PROJECTS"));
  } finally {
    areAllProjectsLoading.value = false;
  }
}

async function fetchData() {
  await fetchCvProjects();
  await fetchAllProjectsCvData();
}

function submitCvProjectAdding(inputProjectObj: IAddOrUpdateCvProjectInput) {
  if (!isOwner.value) return;

  areCvProjectsLoading.value = true;

  createCvProject(inputProjectObj)
    .then((freshCvProjectsServerData) => {
      updateCvProjectsValue(freshCvProjectsServerData);

      setCvProjectsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setCvProjectsErrorValues(error);
    })
    .finally(() => {
      areCvProjectsLoading.value = false;
    });
}

function submitCvProjectRemoving(inputProjectObj: IRemoveCvProjectInput) {
  if (!isOwner.value) return;

  areCvProjectsLoading.value = true;

  deleteCvProject(inputProjectObj)
    .then((freshCvProjectsServerData) => {
      updateCvProjectsValue(freshCvProjectsServerData);

      setCvProjectsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setCvProjectsErrorValues(error);
    })
    .finally(() => {
      areCvProjectsLoading.value = false;
    });
}

function handleOpenCreateModal() {
  if (!isOwner.value) return;

  isCreateModalOpen.value = true;
}

function handleCloseCreateModal() {
  isCreateModalOpen.value = false;
}

function handleOpenDeleteModal(projectId: string, projectName: string) {
  if (!isOwner.value) return;

  addingProjectId.value = projectId;
  addingProjectName.value = projectName;
  isDeleteModalOpen.value = true;
}

function handleCloseDeleteModal() {
  isDeleteModalOpen.value = false;
}

const handleTableFilter: ICvProjectsFilterFunction = (value, query, item) => {
  if (!item) return false;
  return (
    item.raw.name.toLowerCase().includes(query.toLowerCase()) ||
    item.raw.internalName.toLowerCase().includes(query.toLowerCase())
  );
};
</script>

<style lang="scss" scoped>
.cv-projects {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__error-wrapper {
    padding-top: 64px;
  }
  &__main-content-wrapper {
    padding: 32px 24px;
    align-self: stretch;
    @media (max-width: $tablet-l) {
      padding: 20px 10px;
    }
    .cv-projects__search-create-controls-wrapper {
      margin-bottom: 22px;
      padding-inline: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      @media (max-width: $tablet-l) {
        margin-bottom: 10px;
      }
      @media (max-width: $tablet-s) {
        padding-inline: 10px;
      }
      @media (max-width: $phone-l) {
        margin-bottom: 5px;
        flex-direction: column;
        align-items: stretch;
      }
      .cv-projects__text-field-wrapper {
        max-width: 320px;
        @media (max-width: $phone-l) {
          max-width: 100%;
        }
      }
      .cv-projects__button {
        border: 1px solid var(--color-text-red);
      }
    }
    .cv-projects__data-table {
      background-color: var(--color-wrapper-bg);
    }
    .cv-projects__table-img-avatar {
      margin: 10px;
      border-radius: 50%;
      height: 50px;
      width: 50px;
    }
    .cv-projects__popup-menu-btn {
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .cv-projects__popup-menu-label {
      font-family: $font-roboto;
    }
  }
}

:deep(.cv-projects__text-field-wrapper .v-field__outline__start) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.cv-projects__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(
    .cv-projects__text-field-wrapper .v-field--active .v-field__outline__start
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(
    .cv-projects__text-field-wrapper .v-field--active .v-field__outline__end
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
:deep(
    .cv-projects__text-field-wrapper
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
  @media (max-width: 999px) {
    max-width: none;
  }
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 80px;
  @media (max-width: 999px) {
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
