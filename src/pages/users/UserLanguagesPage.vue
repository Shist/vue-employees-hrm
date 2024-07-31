<template>
  <div class="user-languages">
    <AppSpinner v-if="areUserLangsLoading" />
    <AppErrorSection
      v-else-if="isUserLangsError"
      :errorMessageKey="userLangsErrorMessage"
    />
    <div v-else class="user-languages__main-content-wrapper">
      <v-btn
        v-if="isOwner"
        variant="text"
        color="var(--color-btn-gray-text)"
        class="user-languages__add-btn"
        @click="handleOpenCreateModal"
      >
        <v-icon class="user-languages__add-icon">mdi-plus</v-icon>
        <span>{{ $t("userLanguagesPage.btnAdd") }}</span>
      </v-btn>
      <span
        v-if="!userLanguages?.length"
        class="user-languages__no-languages-label"
      >
        {{ $t("userLanguagesPage.noLanguagesMsg") }}
      </span>
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
              (e: PointerEvent) =>
                handleSetCardForDeletion(userLanguage.name, userLanguageIndex, e.pointerType === 'touch')
            "
            v-long-press="
              () =>
                handleSetCardForDeletion(
                  userLanguage.name,
                  userLanguageIndex,
                  false
                )
            "
          >
            <v-card-item class="user-languages__language-card-content">
              <span
                class="user-languages__language-proficiency"
                :class="getClassByProficiency(userLanguage.proficiency)"
                >{{
                  $t(
                    `userLanguagesPage.languageProficiency.${userLanguage.proficiency}`
                  )
                }}</span
              >
              <span class="user-languages__language-label">{{
                userLanguage.name
              }}</span>
            </v-card-item>
          </v-card>
        </div>
      </div>
      <div
        class="user-languages__delete-btns-footer"
        v-show="languagesForDeletionAmount > 0"
        :style="{ paddingRight: scrollbarWidth }"
      >
        <div class="user-languages__delete-btns-wrapper">
          <v-btn
            variant="text"
            color="var(--color-btn-gray-text)"
            class="user-languages__cancel-deletion-btn"
            @click="clearUserDeletionLanguages"
          >
            {{ $t("button.cancelButton") }}
          </v-btn>
          <v-btn
            variant="text"
            color="var(--color-btn-gray-text)"
            class="user-languages__deletion-btn"
            @click="submitUserLanguagesDeletion"
          >
            <span class="user-languages__deletion-btn-label">{{
              $t("button.deleteButton")
            }}</span>
            <span class="user-languages__deletion-btn-num">
              {{ languagesForDeletionAmount }}
            </span>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
  <LanguageModal
    :isOpen="isModalOpen"
    :oLanguageForModal="oLanguageForModal"
    :userId="userId"
    :userLanguages="userLanguages"
    :allLanguages="allLanguages"
    :areAllLangsLoading="areAllLangsLoading"
    :isAllLangsError="isAllLangsError"
    @onCreateUserLanguage="submitUserLanguageCreate"
    @onUpdateUserLanguage="submitUserLanguageUpdate"
    @closeModal="handleCloseModal"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useScrollbarWidth } from "@/store/scrollbarWidth";
import { useI18n } from "vue-i18n";
import LanguageModal from "@/components/user/languages/LanguageModal.vue";
import useToast from "@/composables/useToast";
import useErrorState from "@/composables/useErrorState";
import {
  createUserLanguage,
  deleteUserLanguages,
  getUserLanguagesById,
  updateUserLanguage,
} from "@/services/users/languages";
import { getAllLanguagesNames } from "@/services/languages";
import handleScrollPadding from "@/utils/handleScrollPadding";
import { Proficiency } from "@/types/enums";
import {
  ILanguagesNamesData,
  IProfileLanguage,
  IAddOrUpdateProfileLanguageInput,
  IDeleteProfileLanguageInput,
} from "@/types/pages/users/languages";

const { t } = useI18n({ useScope: "global" });

const { scrollbarWidth } = storeToRefs(useScrollbarWidth());

const route = useRoute();

const userId = computed<string>(() => {
  // eslint-disable-next-line
  const [section, userId, tab] = route.fullPath.slice(1).split("/");
  return userId;
});

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === userId.value);

const { setErrorToast } = useToast();

const {
  isLoading: areUserLangsLoading,
  isError: isUserLangsError,
  errorMessageKey: userLangsErrorMessage,
  setErrorValuesToDefault: setUserLangsErrorValuesToDefault,
  setErrorValues: setUserLangsErrorValues,
} = useErrorState();

const {
  isLoading: areAllLangsLoading,
  isError: isAllLangsError,
  setErrorValuesToDefault: setAllLangsErrorValuesToDefault,
  setErrorValues: setAllLangsErrorValues,
} = useErrorState();

const userLanguages = ref<IProfileLanguage[] | null>(null);
const allLanguages = ref<ILanguagesNamesData[] | null>(null);

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

watch(isModalOpen, (newValue) => {
  handleScrollPadding(newValue);
});

function updateUserLanguagesValue(userLanguagesData: IProfileLanguage[]) {
  languagesForDeletionNames.clear();
  aLanguagesDeletionState.splice(
    0,
    aLanguagesDeletionState.length,
    ...new Array(userLanguagesData.length).fill(false)
  );
  userLanguages.value = userLanguagesData;
}

async function fetchUserLanguages() {
  areUserLangsLoading.value = true;

  try {
    const userLanguagesData = await getUserLanguagesById(userId.value);

    if (!userLanguagesData) return;

    updateUserLanguagesValue(userLanguagesData);

    setUserLangsErrorValuesToDefault();
  } catch (error: unknown) {
    setUserLangsErrorValues(error);
  } finally {
    areUserLangsLoading.value = false;
  }
}

async function fetchAllLanguagesNames() {
  areAllLangsLoading.value = true;

  try {
    const languagesData = await getAllLanguagesNames();

    if (!languagesData) return;

    allLanguages.value = languagesData;

    setAllLangsErrorValuesToDefault();
  } catch (error: unknown) {
    setAllLangsErrorValues(error);

    setErrorToast(t("errors.FAILED_TO_LOAD_LANGUAGES"));
  } finally {
    areAllLangsLoading.value = false;
  }
}

async function fetchData() {
  await fetchUserLanguages();
  await fetchAllLanguagesNames();
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

  areUserLangsLoading.value = true;

  createUserLanguage(languageInputObj)
    .then((freshUserLanguages) => {
      if (!freshUserLanguages) return;
      updateUserLanguagesValue(freshUserLanguages);

      setUserLangsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setUserLangsErrorValues(error);
    })
    .finally(() => {
      areUserLangsLoading.value = false;
    });
}

function submitUserLanguageUpdate(
  languageInputObj: IAddOrUpdateProfileLanguageInput
) {
  if (!isOwner.value) return;

  areUserLangsLoading.value = true;

  updateUserLanguage(languageInputObj)
    .then((freshUserLanguages) => {
      if (!freshUserLanguages) return;
      updateUserLanguagesValue(freshUserLanguages);

      setUserLangsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setUserLangsErrorValues(error);
    })
    .finally(() => {
      areUserLangsLoading.value = false;
    });
}

function handleCloseModal() {
  isModalOpen.value = false;
}

function handleSetCardForDeletion(
  languageName: string,
  languageIndex: number,
  isContextMenuTouch: boolean
) {
  if (!isOwner.value || isContextMenuTouch) return;

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

  areUserLangsLoading.value = true;

  const languagesToBeDeleted: IDeleteProfileLanguageInput = {
    userId: Number(userId.value),
    name: [...languagesForDeletionNames],
  };

  deleteUserLanguages(languagesToBeDeleted)
    .then((freshUserLanguages) => {
      if (!freshUserLanguages) return;
      updateUserLanguagesValue(freshUserLanguages);

      setUserLangsErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setUserLangsErrorValues(error);
    })
    .finally(() => {
      areUserLangsLoading.value = false;
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
  padding: 64px 24px 100px;
  max-width: 850px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: $tablet-l) {
    padding: 32px 12px 92px;
  }
  @media (max-width: $phone-l) {
    padding: 16px 10px 84px;
  }
  &__main-content-wrapper {
    margin: 0 auto;
    max-width: 850px;
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 32px;
    @media (max-width: $tablet-l) {
      row-gap: 20px;
    }
    @media (max-width: $phone-l) {
      row-gap: 15px;
    }
    .user-languages__add-btn {
      font-size: 18px;
      line-height: 28px;
      text-transform: none;
      border-radius: 0;
      .user-languages__add-icon {
        font-size: 28px;
      }
    }
    .user-languages__no-languages-label {
      @include default-text(28px, 32px);
      color: var(--color-gray-label-text);
      text-align: center;
      @media (max-width: $phone-l) {
        font-size: 24px;
        line-height: 28px;
      }
    }
    .user-languages__languages-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 5px;
      @media (max-width: $tablet-l) {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: $phone-l) {
        grid-template-columns: 1fr;
      }
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
    .user-languages__delete-btns-footer {
      padding-block: 32px;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(
        rgba(255, 255, 255, 0) 0%,
        rgb(var(--color-wrapper-bg-rgb)) 40%
      );
      .user-languages__delete-btns-wrapper {
        margin: 0 auto;
        max-width: 810px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: 10px;
        @media (max-width: $laptop-m) {
          max-width: none;
          padding-inline: 70px;
        }
        @media (max-width: $tablet-l) {
          padding-block: 28px;
        }
        @media (max-width: $phone-l) {
          padding-inline: 30px;
          padding-block: 24px;
        }
        .user-languages__cancel-deletion-btn {
          padding: 6px;
          max-width: 150px;
          width: 100%;
          color: var(--color-btn-gray-text);
          background-color: var(--color-wrapper-bg);
          border-radius: 0;
          border: 1px solid rgba(var(--color-btn-gray-text-rgb), 0.5);
          &:hover {
            background-color: rgba(var(--color-btn-gray-text-rgb), 0.08);
            border: 1px solid var(--color-btn-gray-text);
          }
          @media (max-width: $phone-l) {
            max-width: 100px;
          }
        }
        .user-languages__deletion-btn {
          padding: 6px;
          max-width: 150px;
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
          @media (max-width: $phone-l) {
            max-width: 100px;
          }
          .user-languages__deletion-btn-label {
            color: var(--color-btn-text);
            @media (max-width: $phone-l) {
              font-size: 9px;
            }
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
}

:deep(.user-languages__add-btn .v-btn__content) {
  column-gap: 16px;
}
:deep(.user-languages__deletion-btn .v-btn__content) {
  column-gap: 12px;
  @media (max-width: $phone-l) {
    column-gap: 8px;
  }
}
:deep(.user-languages__language-card .v-card-item__content) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 16px;
  @media (max-width: $phone-l) {
    gap: 10px;
  }
}
:deep(
    .user-languages__language-card
      .v-card-item__content
      .user-languages__language-label
  ) {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
:deep(.user-languages__cancel-deletion-btn .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 9px;
  }
}
</style>
