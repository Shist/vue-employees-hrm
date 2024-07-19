<template>
  <div class="cv-projects">
    <AppSpinner v-if="isLoading" class="cv-projects__spinner" />
    <AppErrorSection
      v-else-if="isError"
      :errorMessage="errorMessage"
      class="cv-projects__error-wrapper"
    />
    <div v-else class="cv-projects__main-content-wrapper">
      <div class="cv-projects__search-create-controls-wrapper">
        <v-text-field
          v-model="search"
          label="Search"
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
        >
          Add project to CV
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="cvProjects"
        :search="search"
        :custom-filter="handleTableFilter"
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
              <v-list-item disabled>
                <v-list-item-title class="cv-projects__popup-menu-label">
                  Project
                </v-list-item-title>
              </v-list-item>
              <v-list-item disabled>
                <v-list-item-title class="cv-projects__popup-menu-label">
                  Update project
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="() => handleOpenDeleteModal(item.projectId, item.name)"
                :disabled="!isOwner"
              >
                <v-list-item-title class="cv-projects__popup-menu-label">
                  Remove project
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </div>
  </div>
  <AddProjectModal
    :isOpen="isCreateModalOpen"
    :cvId="cvId"
    :projects="leftProjectsData"
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
import AddProjectModal from "@/components/cv/projects/AddProjectModal.vue";
import RemoveProjectModal from "@/components/cv/projects/RemoveProjectModal.vue";
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

const headers = [
  { key: "name", title: "Name" },
  { key: "internalName", title: "Internal Name", sortable: false },
  { key: "domain", title: "Domain", sortable: false },
  { key: "startDate", title: "Start Date", sortable: false },
  { key: "endDate", title: "End Date", sortable: false },
  { key: "options", sortable: false },
];

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const cvProjects = reactive<ICvProjectsTableData[]>([]);
const allProjectsData = reactive<IProjectsData[]>([]);

const leftProjectsData = computed<IProjectsData[]>(() => {
  if (!allProjectsData.length) {
    return [];
  }

  const cvProjectsSet = new Set(cvProjects.map((cvProject) => cvProject.name));

  return allProjectsData.filter(
    (cvProject) => !cvProjectsSet.has(cvProject.name)
  );
});

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

async function fetchData() {
  isLoading.value = true;

  try {
    const cvProjectsServerData = await getCvProjectsById(cvId.value);
    const allProjectsServerData = await getAllProjectsData();

    updateCvProjectsValue(cvProjectsServerData);

    allProjectsData.splice(
      0,
      allProjectsData.length,
      ...allProjectsServerData.map((projectServerData) => ({
        id: projectServerData.id,
        name: projectServerData.name,
        startDate: projectServerData.start_date,
        endDate: projectServerData.end_date,
      }))
    );

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
}

function submitCvProjectAdding(inputProjectObj: IAddOrUpdateCvProjectInput) {
  if (!isOwner.value) return;

  isLoading.value = true;

  createCvProject(inputProjectObj)
    .then((freshCvProjectsServerData) => {
      updateCvProjectsValue(freshCvProjectsServerData);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function submitCvProjectRemoving(inputProjectObj: IRemoveCvProjectInput) {
  if (!isOwner.value) return;

  isLoading.value = true;

  deleteCvProject(inputProjectObj)
    .then((freshCvProjectsServerData) => {
      updateCvProjectsValue(freshCvProjectsServerData);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
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
  &__spinner {
    margin-top: 64px;
  }
  &__error-wrapper {
    padding-top: 64px;
  }
  &__main-content-wrapper {
    padding: 32px 24px;
    align-self: stretch;
    .cv-projects__search-create-controls-wrapper {
      margin-bottom: 22px;
      padding-inline: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cv-projects__text-field-wrapper {
        max-width: 320px;
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
}
:deep(.v-table > .v-table__wrapper > table > thead > tr > th:last-child) {
  width: 80px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 80px;
}
</style>
