<template>
  <div class="user-cvs">
    <AppSpinner v-if="isLoading" class="user-cvs__spinner" />
    <AppErrorSection
      v-else-if="isError"
      :errorMessage="errorMessage"
      class="user-cvs__error-wrapper"
    />
    <div v-else class="user-cvs__main-content-wrapper">
      <div class="user-cvs__search-create-controls-wrapper">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          single-line
          class="user-cvs__text-field-wrapper"
          hide-details
        />
        <v-btn
          v-if="isOwner"
          rounded
          prepend-icon="mdi-plus"
          color="var(--color-wrapper-bg)"
          elevation="0"
          class="user-cvs__button text-red-darken-4"
          @click="handleOpenCreateModal"
        >
          Create CV
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="userCVs"
        :search="search"
        :class="{ 'user-cvs__data-table': true }"
        hide-details
      >
        <template v-slot:[`item.options`]="{ item }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                v-bind="props"
                class="user-cvs__popup-menu-btn"
              />
            </template>
            <v-list>
              <v-list-item @click="() => openUserCV(item.id)">
                <v-list-item-title class="user-cvs__popup-menu-label">
                  Details
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="() => handleOpenDeleteModal(item.id, item.name)"
                :disabled="!isOwner"
              >
                <v-list-item-title class="user-cvs__popup-menu-label">
                  Delete CV
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </div>
  </div>
  <CreateCVModal
    :isOpen="isCreateModalOpen"
    :userID="userID"
    @onCreateUserCV="submitUserCVCreate"
    @closeModal="handleCloseCreateModal"
  />
  <DeleteCVModal
    :isOpen="isDeleteModalOpen"
    :cvID="openedCVID"
    :cvName="openedCVName"
    @onDeleteUserCV="submitUserCVDeletion"
    @closeModal="handleCloseDeleteModal"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import CreateCVModal from "@/components/user/cvs/CreateCVModal.vue";
import DeleteCVModal from "@/components/user/cvs/DeleteCVModal.vue";
import useErrorState from "@/composables/useErrorState";
import { getUserCVsNamesByID } from "@/services/users/cvs";
import { createCV, deleteCV } from "@/services/cvs";
import handleScrollPadding from "@/utils/handleScrollPadding";
import { ROUTES } from "@/constants/router";
import { IUserCVNameData } from "@/types/userCVsUI";
import { ICreateCVInput, IDeleteCVInput } from "@/types/backend-interfaces/cv";

const router = useRouter();
const route = useRoute();

const userID = computed<string>(() => {
  // eslint-disable-next-line
  const [section, userID, tab] = route.fullPath.slice(1).split("/");
  return userID;
});

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === userID.value);

const openedCVID = ref<string | null>(null);
const openedCVName = ref<string | null>(null);

function openUserCV(cvID: string) {
  router.push(`${ROUTES.CVS.PATH}/${cvID}`);
}

const search = ref("");

const headers = [
  { key: "name", title: "Name" },
  { key: "description", title: "Description", sortable: false },
  { key: "options", sortable: false },
];

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const userCVs = reactive<IUserCVNameData[]>([]);

const isCreateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

onMounted(async () => {
  await fetchData();
  isLoading.value = false;
});

watch(userID, async () => {
  isLoading.value = true;
  await fetchData();
  isLoading.value = false;
});

watch(isCreateModalOpen, (newValue) => {
  handleScrollPadding(newValue);
});

watch(isDeleteModalOpen, (newValue) => {
  handleScrollPadding(newValue);
});

async function fetchData() {
  try {
    const cvsData = await getUserCVsNamesByID(userID.value);

    if (!cvsData) return;

    userCVs.splice(0, userCVs.length, ...cvsData);

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  }
}

function submitUserCVCreate(cvInputObj: ICreateCVInput) {
  if (!isOwner.value) return;

  isLoading.value = true;

  createCV(cvInputObj)
    .then((createdUserCV) => {
      if (!createdUserCV) return;
      userCVs.push(createdUserCV);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

async function submitUserCVDeletion(cvInputObj: IDeleteCVInput) {
  if (!isOwner.value) return;

  isLoading.value = true;

  try {
    await deleteCV(cvInputObj);

    await fetchData();

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
}

function handleOpenCreateModal() {
  if (!isOwner.value) return;

  isCreateModalOpen.value = true;
}

function handleCloseCreateModal() {
  isCreateModalOpen.value = false;
}

function handleOpenDeleteModal(cvID: string, cvName: string) {
  if (!isOwner.value) return;

  openedCVID.value = cvID;
  openedCVName.value = cvName;
  isDeleteModalOpen.value = true;
}

function handleCloseDeleteModal() {
  isDeleteModalOpen.value = false;
}
</script>

<style lang="scss" scoped>
.user-cvs {
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
    .user-cvs__search-create-controls-wrapper {
      margin-bottom: 22px;
      padding-inline: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .user-cvs__text-field-wrapper {
        max-width: 320px;
      }
      .user-cvs__button {
        border: 1px solid var(--color-text-red);
      }
    }
    .user-cvs__data-table {
      background-color: var(--color-wrapper-bg);
    }
    .user-cvs__table-img-avatar {
      margin: 10px;
      border-radius: 50%;
      height: 50px;
      width: 50px;
    }
    .user-cvs__popup-menu-btn {
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .user-cvs__popup-menu-label {
      font-family: $font-roboto;
    }
  }
}

:deep(.user-cvs__text-field-wrapper .v-field__outline__start) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.user-cvs__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.user-cvs__text-field-wrapper .v-field--active .v-field__outline__start) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(.user-cvs__text-field-wrapper .v-field--active .v-field__outline__end) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
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
