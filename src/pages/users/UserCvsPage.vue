<template>
  <div class="user-cvs">
    <AppErrorSection
      v-if="isError"
      :errorMessageKey="errorMessageKey"
      class="user-cvs__error-wrapper"
    />
    <div v-else class="user-cvs__main-content-wrapper">
      <div class="user-cvs__search-create-controls-wrapper">
        <v-text-field
          v-model="search"
          :placeholder="$t('placeholder.search')"
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
          :loading="isLoading"
        >
          {{ $t("cvsPage.createButton") }}
        </v-btn>
      </div>
      <v-skeleton-loader type="table" :loading="isLoading">
        <v-data-table
          :headers="headers"
          :items="userCvs"
          :search="search"
          :class="{ 'user-cvs__data-table': true }"
          :no-data-text="$t('cvsPage.noCvs')"
          :mobile="null"
          :mobile-breakpoint="750"
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
                <v-list-item
                  v-for="cvItem in cvMenuItems"
                  :key="cvItem.title"
                  v-on:click="cvItem.click(item.id, item.name)"
                  :disabled="checkOwner(cvItem.title, userId)"
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
    :userId="userId"
    @onCreateUserCv="submitUserCvCreate"
    @closeModal="handleCloseCreateModal"
  />
  <DeleteCvModal
    :isOpen="isDeleteModalOpen"
    :cvId="openedCvId"
    :cvName="openedCvName"
    @onDeleteUserCv="submitUserCvDeletion"
    @closeModal="handleCloseDeleteModal"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "vue-i18n";
import CreateCvModal from "@/components/user/cvs/CreateCvModal.vue";
import DeleteCvModal from "@/components/user/cvs/DeleteCvModal.vue";
import useErrorState from "@/composables/useErrorState";
import { getUserCvsNamesById } from "@/services/users/cvs";
import { createCv, deleteCv } from "@/services/cvs/cvs";
import handleScrollPadding from "@/utils/handleScrollPadding";
import { ROUTES } from "@/constants/router";
import { IUserCvNameData } from "@/types/pages/users/cvs";
import { ICreateCvInput, IDeleteCvInput } from "@/types/cvsOperations";

const { t } = useI18n({ useScope: "global" });

const router = useRouter();
const route = useRoute();

const userId = computed<string>(() => {
  // eslint-disable-next-line
  const [section, userId, tab] = route.fullPath.slice(1).split("/");
  return userId;
});

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === userId.value);

const openedCvId = ref<string | null>(null);
const openedCvName = ref<string | null>(null);

function openUserCv(cvId: string) {
  router.push(`${ROUTES.CVS.PATH}/${cvId}`);
}

const search = ref("");

const headers = computed(() => {
  return [
    { key: "name", title: t(`cvsPage.name`) },
    { key: "description", title: t(`cvsPage.description`), sortable: false },
    { key: "options", sortable: false },
  ];
});

const cvMenuItems = computed(() => {
  return [
    { title: t(`cvsPage.details`), click: openUserCv },
    { title: t(`cvsPage.deleteCv`), click: handleOpenDeleteModal },
  ];
});

const {
  isLoading,
  isError,
  errorMessageKey,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const userCvs = reactive<IUserCvNameData[]>([]);

const isCreateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

onMounted(async () => {
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
    const cvsData = await getUserCvsNamesById(userId.value);

    if (!cvsData) return;

    userCvs.splice(0, userCvs.length, ...cvsData);

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  }
}

async function submitUserCvCreate(cvInputObj: ICreateCvInput) {
  if (!isOwner.value) return;

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
  if (!isOwner.value) return;

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

function handleOpenCreateModal() {
  if (!isOwner.value) return;

  isCreateModalOpen.value = true;
}

function handleCloseCreateModal() {
  isCreateModalOpen.value = false;
}

function handleOpenDeleteModal(cvId: string, cvName: string) {
  if (!isOwner.value) return;

  openedCvId.value = cvId;
  openedCvName.value = cvName;
  isDeleteModalOpen.value = true;
}

function handleCloseDeleteModal() {
  isDeleteModalOpen.value = false;
}

function checkOwner(cvItemTitle: string, cvUserId: string) {
  if (cvItemTitle === t("cvsPage.details")) return false;
  return Number(authStoreUser.value?.id) !== Number(cvUserId);
}
</script>

<style lang="scss" scoped>
.user-cvs {
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
    .user-cvs__search-create-controls-wrapper {
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
      .user-cvs__text-field-wrapper {
        max-width: 320px;
        @media (max-width: $phone-l) {
          max-width: 100%;
        }
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
:deep(
    .user-cvs__text-field-wrapper
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
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(1)) {
  max-width: 200px;
  @media (max-width: 749px) {
    max-width: none;
  }
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(2)) {
  max-width: 400px;
  @media (max-width: 749px) {
    max-width: none;
  }
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 80px;
  @media (max-width: 749px) {
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
