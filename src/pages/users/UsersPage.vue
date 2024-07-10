<template>
  <div class="main-page">
    <v-progress-circular
      v-if="isPageLoading"
      :size="100"
      :width="10"
      color="var(--color-spinner)"
      indeterminate
      class="main-page__spinner"
    />
    <div v-else-if="isError" class="main-page__error-wrapper">
      <h4 class="main-page__error-message">❌ {{ errorMessage }}</h4>
      <v-btn
        v-if="isNotFoundError"
        class="main-page__back-to-main-btn"
        router
        :to="ROUTES.USERS.PATH"
      >
        Back to the main page
      </v-btn>
      <span v-if="!isNotFoundError" class="main-page__try-to-reload-label">
        Please try to reload the page
      </span>
    </div>
    <div v-else class="main-page__main-content-wrapper">
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        single-line
        class="main-page__text-field-wrapper"
        hide-details
      />
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :class="{ 'main-page__data-table': true }"
        hide-details
      >
        <template v-slot:[`item.avatar`]="{ item }">
          <v-avatar color="var(--color-wrapper-bg)" size="default">
            <v-img
              :src="item.avatar ?? undefined"
              alt="Avatar"
              class="main-page__table-img-avatar"
            />
          </v-avatar>
        </template>
        <template v-slot:[`item.options`]="{ item }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                v-bind="props"
                class="main-page__popup-menu-btn"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item @click="() => openUserProfile(item.id)">
                <v-list-item-title class="main-page__popup-menu-label">
                  Profile
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="console.log('Update user')" disabled>
                <v-list-item-title class="main-page__popup-menu-label">
                  Update user
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="console.log('Delete user')" disabled>
                <v-list-item-title class="main-page__popup-menu-label">
                  Delete user
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "@/constants/router";
import { getAllUsers } from "@/services/users";
import { IUsersTableData } from "@/types/usersTableUI";
import useToast from "@/composables/useToast";
import { UNEXPECTED_ERROR } from "@/constants/errorMessage";

const router = useRouter();

function openUserProfile(userID: number) {
  router.push(`${ROUTES.USERS.PATH}/${userID}`);
}

const search = ref("");

const headers = [
  { key: "avatar", sortable: false },
  { key: "first_name", title: "First Name" },
  { key: "last_name", title: "Last Name" },
  { key: "email", title: "Email" },
  { key: "department_name", title: "Department" },
  { key: "position_name", title: "Position" },
  { key: "options", sortable: false },
];

const isPageLoading = ref(true);
const users = reactive<IUsersTableData[]>([]);

const isError = ref(false);
const errorMessage = ref(UNEXPECTED_ERROR);
const isNotFoundError = ref(false);

const { setErrorToast } = useToast();

function setErrorValuesToDefault() {
  isError.value = false;
  errorMessage.value = UNEXPECTED_ERROR;
  isNotFoundError.value = false;
}

onMounted(async () => {
  isPageLoading.value = true;

  getAllUsers()
    .then((usersData) => {
      users.splice(0, users.length, ...usersData);

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
</script>

<style lang="scss" scoped>
.main-page {
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
    .main-page__error-message {
      @include default-text(26px, 32px);
    }
    .main-page__back-to-main-btn {
      color: var(--color-btn-text);
      background-color: var(--color-btn-bg);
      border-radius: 0;
      &:hover {
        background-color: var(--color-btn-bg-hover);
      }
    }
    .main-page__try-to-reload-label {
      @include default-text(20px, 26px);
    }
  }
  &__main-content-wrapper {
    align-self: stretch;
    .main-page__text-field-wrapper {
      margin-left: 20px;
      margin-bottom: 22px;
      max-width: 320px;
    }
    .main-page__data-table {
      background-color: var(--color-wrapper-bg);
    }
    .main-page__table-img-avatar {
      margin: 10px;
      border-radius: 50%;
      height: 50px;
      width: 50px;
    }
    .main-page__popup-menu-btn {
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .main-page__popup-menu-label {
      font-family: $font-roboto;
    }
  }
}

:deep(.main-page__text-field-wrapper .v-field__outline__start) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.main-page__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(
    .main-page__text-field-wrapper .v-field--active .v-field__outline__start
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(.main-page__text-field-wrapper .v-field--active .v-field__outline__end) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  padding: 12px 16px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  padding: 12px 16px;
}
</style>
