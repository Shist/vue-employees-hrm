<template>
  <div class="user-languages">
    <v-progress-circular
      v-if="isPageLoading"
      :size="100"
      :width="10"
      color="var(--color-spinner)"
      indeterminate
    />
    <div v-else-if="isError" class="user-languages__error-wrapper">
      <h4 class="user-languages__error-message">❌ {{ errorMessage }}</h4>
      <v-btn
        v-if="isNotFoundError"
        class="user-languages__back-to-main-btn"
        router
        :to="ROUTES.USERS.PATH"
      >
        Back to the main page
      </v-btn>
      <span v-if="!isNotFoundError" class="user-languages__try-to-reload-label">
        Please try to reload the page
      </span>
    </div>
    <div v-else-if="userLanguages" class="user-languages__main-content-wrapper">
      <v-btn
        v-if="isOwner"
        variant="text"
        color="var(--color-btn-gray-text)"
        class="user-languages__add-btn"
        @click="handleOpenCreateModal"
      >
        <v-icon class="user-languages__add-icon">mdi-plus</v-icon>
        <span>Add language</span>
      </v-btn>
      <div class="user-languages__languages-wrapper">
        <div
          v-for="(userLanguage, userLanguageIndex) in userLanguages"
          :key="userLanguage.name"
        >
          <v-card
            variant="text"
            class="user-languages__language-card"
            :class="{
              'user-languages__language-card_is-deleting':
                aLanguagesDeletionState[userLanguageIndex],
            }"
            @click="
              () =>
                handleOpenEditModal(
                  {
                    name: userLanguage.name,
                    proficiency: userLanguage.proficiency,
                  },
                  userLanguageIndex
                )
            "
            @contextmenu.prevent="
              () =>
                handleSetCardForDeletion(userLanguage.name, userLanguageIndex)
            "
          >
            <v-card-item class="user-languages__language-card-content">
              <span
                class="user-languages__language-proficiency"
                :class="getClassByProficiency(userLanguage.proficiency)"
                >{{ userLanguage.proficiency }}</span
              >
              <span class="user-languages__language-label">{{
                userLanguage.name
              }}</span>
            </v-card-item>
          </v-card>
        </div>
      </div>
      <div
        v-show="languagesForDeletionAmount > 0"
        class="user-languages__delete-btns-wrapper"
      >
        <v-btn
          variant="text"
          color="var(--color-btn-gray-text)"
          class="user-languages__cancel-deletion-btn"
          @click="clearUserDeletionLanguages"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          color="var(--color-btn-gray-text)"
          class="user-languages__deletion-btn"
          @click="submitUserLanguagesDeletion"
        >
          <span class="user-languages__deletion-btn-label">Delete</span>
          <span class="user-languages__deletion-btn-num">
            {{ languagesForDeletionAmount }}
          </span>
        </v-btn>
      </div>
    </div>
  </div>
  <LanguageModal
    :isOpen="isModalOpen"
    :oLanguageForModal="oLanguageForModal"
    :userID="id"
    :languages="leftLanguages"
    @onCreateUserLanguage="submitUserLanguageCreate"
    @onUpdateUserLanguage="submitUserLanguageUpdate"
    @closeModal="handleCloseModal"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import LanguageModal from "@/components/user/languages/LanguageModal.vue";
import { useRoute } from "vue-router";
import { getAllLanguagesNames } from "@/services/languages";
import { Proficiency } from "@/types/backend-interfaces/language/proficiency";
import {
  IProfileLanguage,
  IAddOrUpdateProfileLanguageInput,
  IDeleteProfileLanguageInput,
} from "@/types/backend-interfaces/user/profile/language";
import { ILanguagesNamesData } from "@/types/userLanguagesUI";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { UNAUTHORIZED_ERROR, UNEXPECTED_ERROR } from "@/constants/errorMessage";
import { ROUTES } from "@/constants/router";
import handleScrollPadding from "@/utils/handleScrollPadding";
import {
  createUserLanguage,
  deleteUserLanguages,
  getUserLanguagesByID,
  updateUserLanguage,
} from "@/services/users/languages";
import { handleLogout } from "@/utils/handleErrors";

const route = useRoute();

const id = computed<string>(() => {
  // eslint-disable-next-line
  const [section, id, tab] = route.fullPath.slice(1).split("/");
  return id;
});

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === id.value);

const isPageLoading = ref(true);

const userLanguages = ref<IProfileLanguage[] | null>(null);
const languages = ref<ILanguagesNamesData[] | null>(null);

const leftLanguages = computed<ILanguagesNamesData[]>(() => {
  if (!userLanguages.value || !languages.value) {
    return [];
  }

  const userLanguagesSet = new Set(
    userLanguages.value.map((language) => language.name)
  );
  return languages.value.filter(
    (language) => !userLanguagesSet.has(language.name)
  );
});

const isError = ref(false);
const errorMessage = ref(UNEXPECTED_ERROR);
const isNotFoundError = ref(false);

const oLanguageForModal = ref<IProfileLanguage | null>(null);
const isModalOpen = ref(false);

const languagesForDeletionNames = reactive(new Set<string>());

const aLanguagesDeletionState = reactive<boolean[]>([]);

const languagesForDeletionAmount = computed<number>(() => {
  return aLanguagesDeletionState.reduce((acc, isDeleting) => {
    if (isDeleting) acc++;
    return acc;
  }, 0);
});

onMounted(() => {
  fetchData();
});

watch(id, () => {
  fetchData();
});

watch(isModalOpen, (newValue) => {
  handleScrollPadding(newValue);
});

function setErrorValuesToDefault() {
  isError.value = false;
  errorMessage.value = UNEXPECTED_ERROR;
  isNotFoundError.value = false;
}

function updateUserLanguagesValue(userLanguagesData: IProfileLanguage[]) {
  languagesForDeletionNames.clear();
  aLanguagesDeletionState.splice(
    0,
    aLanguagesDeletionState.length,
    ...new Array(userLanguagesData.length).fill(false)
  );
  userLanguages.value = userLanguagesData;
}

function fetchData() {
  isPageLoading.value = true;
  Promise.all([getUserLanguagesByID(id.value), getAllLanguagesNames()])
    .then(([userLanguagesData, languagesData]) => {
      if (!userLanguagesData || !languagesData) return;

      updateUserLanguagesValue(userLanguagesData);

      languages.value = languagesData;
      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      isError.value = true;

      if (error instanceof Error) {
        if (error.cause === UNAUTHORIZED_ERROR) {
          handleLogout();
          return;
        }

        errorMessage.value = error.message;

        if (error.name === "NotFoundError") {
          isNotFoundError.value = true;
        }
      }
    })
    .finally(() => {
      isPageLoading.value = false;
    });
}

function handleOpenCreateModal() {
  if (!isOwner.value) return;

  oLanguageForModal.value = null;
  isModalOpen.value = true;
}

function handleOpenEditModal(
  _oLanguageForModal: IProfileLanguage,
  languageIndex: number
) {
  if (!isOwner.value) return;

  if (aLanguagesDeletionState[languageIndex]) {
    languagesForDeletionNames.delete(_oLanguageForModal.name);
    aLanguagesDeletionState[languageIndex] = false;
  } else {
    oLanguageForModal.value = _oLanguageForModal;
    isModalOpen.value = true;
  }
}

function submitUserLanguageCreate(
  languageInputObj: IAddOrUpdateProfileLanguageInput
) {
  if (!isOwner.value) return;

  isPageLoading.value = true;

  createUserLanguage(languageInputObj)
    .then((freshUserLanguages) => {
      if (!freshUserLanguages) return;
      updateUserLanguagesValue(freshUserLanguages);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      isError.value = true;

      if (error instanceof Error) {
        if (error.cause === UNAUTHORIZED_ERROR) {
          handleLogout();
          return;
        }

        errorMessage.value = error.message;

        if (error.name === "NotFoundError") {
          isNotFoundError.value = true;
        }
      }
    })
    .finally(() => {
      isPageLoading.value = false;
    });
}

function submitUserLanguageUpdate(
  languageInputObj: IAddOrUpdateProfileLanguageInput
) {
  if (!isOwner.value) return;

  isPageLoading.value = true;

  updateUserLanguage(languageInputObj)
    .then((freshUserLanguages) => {
      if (!freshUserLanguages) return;
      updateUserLanguagesValue(freshUserLanguages);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      isError.value = true;

      if (error instanceof Error) {
        if (error.cause === UNAUTHORIZED_ERROR) {
          handleLogout();
          return;
        }

        errorMessage.value = error.message;

        if (error.name === "NotFoundError") {
          isNotFoundError.value = true;
        }
      }
    })
    .finally(() => {
      isPageLoading.value = false;
    });
}

function handleCloseModal() {
  isModalOpen.value = false;
}

function handleSetCardForDeletion(languageName: string, languageIndex: number) {
  if (!isOwner.value) return;

  if (languagesForDeletionNames.has(languageName)) {
    languagesForDeletionNames.delete(languageName);
    aLanguagesDeletionState[languageIndex] = false;
  } else {
    languagesForDeletionNames.add(languageName);
    aLanguagesDeletionState[languageIndex] = true;
  }
}

function clearUserDeletionLanguages() {
  languagesForDeletionNames.clear();

  aLanguagesDeletionState.fill(false);
}

function submitUserLanguagesDeletion() {
  if (!isOwner.value) return;

  isPageLoading.value = true;

  const languagesToBeDeleted: IDeleteProfileLanguageInput = {
    userId: Number(id.value),
    name: [...languagesForDeletionNames],
  };

  deleteUserLanguages(languagesToBeDeleted)
    .then((freshUserLanguages) => {
      if (!freshUserLanguages) return;
      updateUserLanguagesValue(freshUserLanguages);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      isError.value = true;

      if (error instanceof Error) {
        if (error.cause === UNAUTHORIZED_ERROR) {
          handleLogout();
          return;
        }

        errorMessage.value = error.message;

        if (error.name === "NotFoundError") {
          isNotFoundError.value = true;
        }
      }
    })
    .finally(() => {
      isPageLoading.value = false;
    });

  clearUserDeletionLanguages();
}

function getClassByProficiency(value: Proficiency) {
  switch (value) {
    case Proficiency.A1:
      return "text-grey-lighten-1";
    case Proficiency.A2:
      return "text-grey-lighten-1";
    case Proficiency.B1:
      return "text-blue-lighten-1";
    case Proficiency.B2:
      return "text-green-lighten-1";
    case Proficiency.C1:
      return "text-yellow-darken-3";
    case Proficiency.C2:
      return "text-yellow-darken-3";
    case Proficiency.Native:
      return "text-red-darken-3";
    default:
      return "text-white";
  }
}
</script>

<style lang="scss" scoped>
.user-languages {
  margin: 0 auto;
  padding: 64px 24px;
  max-width: 850px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__error-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    .user-languages__error-message {
      @include default-text(26px, 32px);
    }
    .user-languages__back-to-main-btn {
      color: var(--color-btn-text);
      background-color: var(--color-btn-bg);
      border-radius: 0;
      &:hover {
        background-color: var(--color-btn-bg-hover);
      }
    }
    .user-languages__try-to-reload-label {
      @include default-text(20px, 26px);
    }
  }
  &__main-content-wrapper {
    margin: 0 auto;
    max-width: 850px;
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 32px;
    .user-languages__add-btn {
      font-size: 18px;
      line-height: 28px;
      text-transform: none;
      border-radius: 0;
      .user-languages__add-icon {
        font-size: 28px;
      }
    }
    .user-languages__languages-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 5px;
      .user-languages__language-card {
        border-radius: 0;
        border: 2px solid var(--color-wrapper-bg);
        .user-languages__language-label {
          color: var(--color-btn-gray-text);
          font-size: 18px;
          line-height: 24px;
        }
        &_is-deleting {
          border: 2px solid var(--color-active-borders);
        }
      }
    }
    .user-languages__delete-btns-wrapper {
      padding-block: 32px;
      margin: 0 auto;
      position: fixed;
      bottom: 0;
      max-width: 800px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(
        rgba(255, 255, 255, 0) 0%,
        rgb(var(--color-wrapper-bg-rgb)) 40%
      );
      .user-languages__cancel-deletion-btn {
        padding: 6px;
        max-width: 100px;
        width: 100%;
        color: var(--color-btn-gray-text);
        background-color: var(--color-wrapper-bg);
        border-radius: 0;
        border: 1px solid rgba(var(--color-btn-gray-text-rgb), 0.5);
        &:hover {
          background-color: rgba(var(--color-btn-gray-text-rgb), 0.08);
          border: 1px solid var(--color-btn-gray-text);
        }
      }
      .user-languages__deletion-btn {
        padding: 6px;
        max-width: 120px;
        width: 100%;
        background-color: var(--color-btn-bg);
        border-radius: 0;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
          rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
          rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
        &:hover {
          background-color: var(--color-btn-bg-hover);
        }
        &:disabled {
          filter: grayscale(50%);
        }
        .user-languages__deletion-btn-label {
          color: var(--color-btn-text);
        }
        .user-languages__deletion-btn-num {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--color-btn-text);
          color: var(--color-btn-bg);
        }
      }
    }
  }
}

:deep(.user-languages__add-btn .v-btn__content) {
  column-gap: 16px;
}
:deep(.user-languages__deletion-btn .v-btn__content) {
  column-gap: 12px;
}
:deep(.user-languages__language-card .v-card-item__content) {
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  align-items: center;
  gap: 16px;
}
</style>
