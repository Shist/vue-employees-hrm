<template>
  <div class="cvs-page">
    <AppErrorSection
      v-if="isError"
      :errorMessage="errorMessage"
      class="cvs-page__error-wrapper"
    />
    <div v-else class="cvs-page__main-content-wrapper">
      <div class="cvs-page__search-create-controls-wrapper">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          single-line
          placeholder="Search"
          class="cvs-page__text-field-wrapper"
          hide-details
        />
        <v-btn
          rounded
          prepend-icon="mdi-plus"
          color="var(--color-wrapper-bg)"
          elevation="0"
          class="cvs-page__button text-red-darken-4"
          @click="handleOpenCreateModal"
          :loading="isLoading"
        >
          Create CV
        </v-btn>
      </div>
      <v-skeleton-loader type="table" :loading="isLoading">
        <v-data-table
          :headers="headers"
          :items="cvs"
          :search="search"
          :custom-filter="handleTableFilter"
          item-key="id"
          class="cvs-page__data-table"
          hide-details
        >
          <template v-slot:[`item.options`]="{ item }">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  v-bind="props"
                  class="cvs-page__popup-menu-btn"
                />
              </template>
              <v-list>
                <v-list-item
                  v-for="cvItem in cvMenuItems"
                  :key="cvItem.title"
                  v-on:click="cvItem.click(item.id, item.name)"
                  :disabled="checkOwner(cvItem.title, item.userId)"
                >
                  <v-list-item-title class="cvs-page__popup-menu-label">
                    {{ cvItem.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </div>
  </div>
  <CreateCvModal
    :isOpen="isCreateModalOpen"
    :userId="`${authStoreUser?.id}`"
    @onCreateUserCv="submitUserCvCreate"
    @closeModal="handleCloseCreateModal"
  />
  <DeleteCvModal
    :isOpen="isDeleteModalOpen"
    :cvId="deletingCvId"
    :cvName="deletingCvName"
    @onDeleteUserCv="submitUserCvDeletion"
    @closeModal="handleCloseDeleteModal"
  />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import CreateCvModal from "@/components/user/cvs/CreateCvModal.vue";
import DeleteCvModal from "@/components/user/cvs/DeleteCvModal.vue";
import useErrorState from "@/composables/useErrorState";
import { createCv, deleteCv, getAllCvs } from "@/services/cvs/cvs";
import handleScrollPadding from "@/utils/handleScrollPadding";
import { ROUTES } from "@/constants/router";
import { ICreateCvInput, IDeleteCvInput } from "@/types/cvsOperations";
import { ICvsTableData } from "@/types/pages/cvs/table";
import { ICvsFilterFunction } from "@/types/vuetifyDataTable";

const router = useRouter();

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;

const deletingCvId = ref<string | null>(null);
const deletingCvName = ref<string | null>(null);

const search = ref("");

const isCreateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const cvs = reactive<ICvsTableData[]>([]);

const headers = [
  { key: "name", title: "Name" },
  { key: "description", title: "Description", sortable: false },
  { key: "email", title: "Employee" },
  { key: "options", sortable: false },
];

const cvMenuItems = [
  { title: "Details", click: openCvDetails },
  { title: "Delete CV", click: handleOpenDeleteModal },
];

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

onMounted(async () => {
  isLoading.value = true;
  await fetchData();
  isLoading.value = false;
});

watch(
  [isCreateModalOpen, isDeleteModalOpen],
  ([newIsCreateModalOpen, newIsDeleteModalOpen]) => {
    handleScrollPadding(newIsCreateModalOpen || newIsDeleteModalOpen);
  }
);

async function fetchData() {
  try {
    const cvsData = await getAllCvs();

    cvs.splice(
      0,
      cvs.length,
      ...cvsData.map((cv) => ({
        id: cv.id,
        name: cv.name,
        description: cv.description,
        education: cv.education ? cv.education : "",
        email: cv.user ? cv.user.email : "",
        userId: cv.user ? cv.user.id : null,
      }))
    );

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  }
}

function checkOwner(cvItemTitle: string, cvUserId: number | null) {
  if (cvItemTitle === "Details") return false;
  return Number(authStoreUser.value?.id) !== Number(cvUserId);
}

function openCvDetails(cvId: number) {
  router.push(`${ROUTES.CVS.PATH}/${cvId}`);
}

function handleOpenCreateModal() {
  isCreateModalOpen.value = true;
}

function handleCloseCreateModal() {
  isCreateModalOpen.value = false;
}

function handleOpenDeleteModal(cvId: number, cvName: string) {
  deletingCvId.value = cvId.toString();
  deletingCvName.value = cvName;
  isDeleteModalOpen.value = true;
}

function handleCloseDeleteModal() {
  isDeleteModalOpen.value = false;
}

async function submitUserCvCreate(cvInputObj: ICreateCvInput) {
  isLoading.value = true;

  try {
    await createCv(cvInputObj);

    await fetchData();

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
}

async function submitUserCvDeletion(cvInputObj: IDeleteCvInput) {
  isLoading.value = true;

  try {
    await deleteCv(cvInputObj);

    await fetchData();

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
}

const handleTableFilter: ICvsFilterFunction = (value, query, item) => {
  if (!item) return false;
  return (
    item.raw.name.toLowerCase().includes(query.toLowerCase()) ||
    item.raw.description.toLowerCase().includes(query.toLowerCase())
  );
};
</script>

<style lang="scss" scoped>
.cvs-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__error-wrapper {
    padding-top: 64px;
  }
  &__main-content-wrapper {
    align-self: stretch;
    .cvs-page__search-create-controls-wrapper {
      margin-bottom: 22px;
      padding: 0 20px 0 33px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cvs-page__text-field-wrapper {
      max-width: 320px;
    }
    .cvs-page__button {
      border: 1px solid var(--color-text-red);
    }
    .cvs-page__data-table {
      background-color: var(--color-wrapper-bg);
    }
    .cvs-page__popup-menu-btn {
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .cvs-page__popup-menu-label {
      font-family: $font-roboto;
    }
  }
}
:deep(.cvs-page__text-field-wrapper .v-field__outline__start) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.cvs-page__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.cvs-page__text-field-wrapper .v-field--active .v-field__outline__start) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(.cvs-page__text-field-wrapper .v-field--active .v-field__outline__end) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
:deep(
    .cvs-page__text-field-wrapper
      .v-field--active
      .v-field__prepend-inner
      .v-icon
  ) {
  opacity: 1;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  font-family: $font-roboto;
  font-size: 14px;
  line-height: 1.4;
  padding: 12px 16px;
  margin-left: auto;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  font-family: $font-roboto;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.013em;
  padding: 12px 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:first-child) {
  max-width: 119px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(2)) {
  max-width: 198px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 52px;
}
</style>
