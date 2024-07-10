<template>
  <div class="user-cvs">
    <v-progress-circular
      v-if="isPageLoading"
      :size="100"
      :width="10"
      color="var(--color-spinner)"
      indeterminate
      class="user-cvs__spinner"
    />
    <div v-else-if="isError" class="user-cvs__error-wrapper">
      <h4 class="user-cvs__error-message">❌ {{ errorMessage }}</h4>
      <v-btn
        v-if="isNotFoundError"
        class="user-cvs__back-to-main-btn"
        router
        :to="ROUTES.USERS.PATH"
      >
        Back to the main page
      </v-btn>
      <span v-if="!isNotFoundError" class="user-cvs__try-to-reload-label">
        Please try to reload the page
      </span>
    </div>
    <div v-else class="user-cvs__main-content-wrapper">
      <div class="users-cvs__search-create-controls-wrapper">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
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
          class="project-page__button text-red-darken-4"
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
              ></v-btn>
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
    :userID="id"
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
import CreateCVModal from "@/components/user/cvs/CreateCVModal.vue";
import DeleteCVModal from "@/components/user/cvs/DeleteCVModal.vue";
import { useRouter, useRoute } from "vue-router";
import { ROUTES } from "@/constants/router";
import { getUserCVsNamesByID } from "@/services/users";
import { createCV, deleteCV } from "@/services/cvs";
import { IUserCVNameData } from "@/types/userCVsUI";
import { ICreateCVInput, IDeleteCVInput } from "@/types/backend-interfaces/cv";
import useToast from "@/composables/useToast";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { UNEXPECTED_ERROR } from "@/constants/errorMessage";
import handleScrollPadding from "@/utils/handleScrollPadding";

const router = useRouter();
const route = useRoute();

const id = computed<string>(() => {
  // eslint-disable-next-line
  const [section, id, tab] = route.fullPath.slice(1).split("/");
  return id;
});

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === id.value);

const openedCVID = ref<string | null>(null);
const openedCVName = ref<string | null>(null);

function openUserCV(cvID: string) {
  router.push(`${ROUTES.CVS.PATH}/${cvID}`);
}

const search = ref("");

const headers = reactive([
  { key: "name", title: "Name" },
  { key: "description", title: "Description", sortable: false },
  { key: "options", sortable: false },
]);

const isPageLoading = ref(true);
const userCVs = reactive<IUserCVNameData[]>([]);

const isError = ref(false);
const errorMessage = ref(UNEXPECTED_ERROR);
const isNotFoundError = ref(false);

const isCreateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const { setErrorToast } = useToast();

function setErrorValuesToDefault() {
  isError.value = false;
  errorMessage.value = UNEXPECTED_ERROR;
  isNotFoundError.value = false;
}

onMounted(async () => {
  await fetchData();
  isPageLoading.value = false;
});

watch(id, async () => {
  isPageLoading.value = true;
  await fetchData();
  isPageLoading.value = false;
});

watch(isCreateModalOpen, (newValue) => {
  handleScrollPadding(newValue);
});

watch(isDeleteModalOpen, (newValue) => {
  handleScrollPadding(newValue);
});

async function fetchData() {
  try {
    const cvsData = await getUserCVsNamesByID(id.value);

    userCVs.splice(0, userCVs.length, ...cvsData);

    setErrorValuesToDefault();
  } catch (error: unknown) {
    isError.value = true;

    if (error instanceof Error) {
      errorMessage.value = error.message;

      if (error.name === "NotFoundError") {
        isNotFoundError.value = true;
      }

      setErrorToast(errorMessage.value);
    }
  }
}

function submitUserCVCreate(cvInputObj: ICreateCVInput) {
  if (!isOwner.value) return;

  isPageLoading.value = true;

  createCV(cvInputObj)
    .then((createdUserCV: IUserCVNameData) => {
      userCVs.push(createdUserCV);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      isError.value = true;
      if (error instanceof Error) {
        errorMessage.value = error.message;
        if (error.name === "NotFoundError") {
          isNotFoundError.value = true;
        }
        setErrorToast(errorMessage.value);
      }
    })
    .finally(() => {
      isPageLoading.value = false;
    });
}

async function submitUserCVDeletion(cvInputObj: IDeleteCVInput) {
  if (!isOwner.value) return;

  isPageLoading.value = true;

  try {
    await deleteCV(cvInputObj);

    await fetchData();

    setErrorValuesToDefault();
  } catch (error: unknown) {
    isError.value = true;

    if (error instanceof Error) {
      errorMessage.value = error.message;

      if (error.name === "NotFoundError") {
        isNotFoundError.value = true;
      }

      setErrorToast(errorMessage.value);
    }
  } finally {
    isPageLoading.value = false;
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
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    .user-cvs__error-message {
      @include default-text(26px, 32px);
    }
    .user-cvs__back-to-main-btn {
      color: var(--color-btn-text);
      background-color: var(--color-btn-bg);
      border-radius: 0;
      &:hover {
        background-color: var(--color-btn-bg-hover);
      }
    }
    .user-cvs__try-to-reload-label {
      @include default-text(20px, 26px);
    }
  }
  &__main-content-wrapper {
    padding: 32px 24px;
    align-self: stretch;
    .users-cvs__search-create-controls-wrapper {
      margin-bottom: 22px;
      padding-inline: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .user-cvs__text-field-wrapper {
        max-width: 320px;
      }
      .project-page__button {
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
