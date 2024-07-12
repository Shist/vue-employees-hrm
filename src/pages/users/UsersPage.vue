<template>
  <div class="main-page">
    <AppSpinner v-if="isLoading" class="main-page__spinner" />
    <AppErrorSection
      v-else-if="isError"
      :errorMessage="errorMessage"
      class="main-page__error-wrapper"
    />
    <div v-else class="main-page__main-content-wrapper">
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        single-line
        class="main-page__text-field-wrapper"
        hide-details
      />
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        class="main-page__data-table"
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
              <v-list-item
                v-for="menuItem in projectMenuItems"
                :key="menuItem.title"
                v-on:click="menuItem.click ? menuItem.click(item.id) : null"
                :disabled="menuItem.disabled"
              >
                <v-list-item-title class="main-page__popup-menu-label">
                  {{ menuItem.title }}
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
import useErrorState from "@/composables/useErrorState";
import { getAllUsers } from "@/services/users/users";
import { ROUTES } from "@/constants/router";
import { IUsersTableData } from "@/types/usersTableUI";

const router = useRouter();

function openUserProfile(userID: number) {
  router.push(`${ROUTES.USERS.PATH}/${userID}`);
}

const search = ref("");

const headers = [
  { key: "avatar", sortable: false },
  { key: "firstName", title: "First Name" },
  { key: "lastName", title: "Last Name" },
  { key: "email", title: "Email" },
  { key: "departmentName", title: "Department" },
  { key: "positionName", title: "Position" },
  { key: "options", sortable: false },
];

const projectMenuItems = [
  { title: "Profile", click: openUserProfile, disabled: false },
  { title: "Update user", disabled: true },
  { title: "Delete user", disabled: true },
];

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const users = reactive<IUsersTableData[]>([]);

onMounted(async () => {
  isLoading.value = true;

  getAllUsers()
    .then((usersData) => {
      users.splice(0, users.length, ...usersData);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
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
