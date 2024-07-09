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
    <div v-else-if="userCVs.length" class="user-cvs__main-content-wrapper">
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
          rounded
          prepend-icon="mdi-plus"
          color="var(--color-wrapper-bg)"
          elevation="0"
          class="project-page__button text-red-darken-4"
          @click="handleOpenModal"
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
              <v-list-item @click="console.log('Delete user')" disabled>
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
    :isOpen="isModalOpen"
    :userID="id"
    @onCreateUserCV="submitUserCVCreate"
    @closeModal="handleCloseModal"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import CreateCVModal from "@/components/user/cvs/CreateCVModal.vue";
import { useRouter, useRoute } from "vue-router";
import { ROUTES } from "@/constants/router";
import { getUserCVsNamesByID } from "@/services/users";
import { IUserCVNameData } from "@/types/userCVsUI";
import { ICreateCVInput } from "@/types/backend-interfaces/cv";
import useToast from "@/composables/useToast";
import { UNEXPECTED_ERROR } from "@/constants/errorMessage";

const router = useRouter();
const route = useRoute();

const id = computed<string>(() => {
  // eslint-disable-next-line
  const [section, id, tab] = route.fullPath.slice(1).split("/");
  return id;
});

function openUserCV(cvID: number) {
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

const isModalOpen = ref(false);

const { setErrorToast } = useToast();

function setErrorValuesToDefault() {
  isError.value = false;
  errorMessage.value = UNEXPECTED_ERROR;
  isNotFoundError.value = false;
}

onMounted(async () => {
  isPageLoading.value = true;

  getUserCVsNamesByID(id.value)
    .then((cvsData) => {
      userCVs.splice(0, userCVs.length, ...cvsData);

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
});

function submitUserCVCreate(cvInputObj: ICreateCVInput) {
  console.log("emit Create CV!!!");
  // isPageLoading.value = true;
  // createUserLanguage(languageInputObj)
  //   .then((freshUserLanguages) => {
  //     updateUserLanguagesValue(freshUserLanguages);
  //     setErrorValuesToDefault();
  //   })
  //   .catch((error: unknown) => {
  //     isError.value = true;
  //     if (error instanceof Error) {
  //       errorMessage.value = error.message;
  //       if (error.name === "NotFoundError") {
  //         isNotFoundError.value = true;
  //       }
  //       setErrorToast(errorMessage.value);
  //     }
  //   })
  //   .finally(() => {
  //     isPageLoading.value = false;
  //   });
}

function handleOpenModal() {
  isModalOpen.value = true;
}

function handleCloseModal() {
  isModalOpen.value = false;
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
