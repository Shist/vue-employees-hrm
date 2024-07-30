<template>
  <div class="main-page">
    <AppErrorSection
      v-if="isError"
      :errorMessageKey="errorMessageKey"
      class="main-page__error-wrapper"
    />
    <div v-else class="main-page__main-content-wrapper">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        single-line
        :placeholder="$t('placeholder.search')"
        class="main-page__text-field-wrapper"
        hide-details
      />
      <v-skeleton-loader type="table" :loading="isLoading">
        <v-data-table
          :headers="headers"
          :items="users"
          :search="search"
          :custom-filter="handleTableFilter"
          :no-data-text="$t('usersPage.noUsers')"
          :mobile="null"
          :mobile-breakpoint="900"
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
      </v-skeleton-loader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useErrorState from "@/composables/useErrorState";
import { getAllUsers } from "@/services/users/users";
import { ROUTES } from "@/constants/router";
import { IUsersTableData } from "@/types/pages/users/table";
import { IUsersFilterFunction } from "@/types/vuetifyDataTable";

const router = useRouter();
const { t } = useI18n({ useScope: "global" });

function openUserProfile(userId: number) {
  router.push(`${ROUTES.USERS.PATH}/${userId}`);
}

const search = ref("");

const users = reactive<IUsersTableData[]>([]);

const headers = computed(() => {
  return [
    { key: "avatar", sortable: false },
    { key: "firstName", title: t(`usersPage.firstName`) },
    { key: "lastName", title: t(`usersPage.lastName`) },
    { key: "email", title: t(`usersPage.email`) },
    { key: "departmentName", title: t(`usersPage.departmentName`) },
    { key: "positionName", title: t(`usersPage.positionName`) },
    { key: "options", sortable: false },
  ];
});

const projectMenuItems = computed(() => {
  return [
    {
      title: t(`usersPage.profile`),
      click: openUserProfile,
      disabled: false,
    },
    { title: t("usersPage.updateUser"), disabled: true },
    { title: t("usersPage.deleteUser"), disabled: true },
  ];
});

const {
  isLoading,
  isError,
  errorMessageKey,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

onMounted(async () => {
  isLoading.value = true;

  try {
    const usersData = await getAllUsers();

    users.splice(
      0,
      users.length,
      ...usersData.map((user) => ({
        id: user.id,
        email: user.email,
        avatar: user.profile.avatar,
        firstName: user.profile.first_name,
        lastName: user.profile.last_name,
        departmentName: user.department_name,
        positionName: user.position_name,
      }))
    );

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
});

const handleTableFilter: IUsersFilterFunction = (value, query, item) => {
  if (!item) return false;

  return (
    (!!item.raw.firstName &&
      item.raw.firstName.toLowerCase().includes(query.toLowerCase())) ||
    (!!item.raw.lastName &&
      item.raw.lastName.toLowerCase().includes(query.toLowerCase()))
  );
};
</script>

<style lang="scss" scoped>
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__error-wrapper {
    padding-top: 64px;
  }
  &__main-content-wrapper {
    align-self: stretch;
    .main-page__text-field-wrapper {
      margin-left: 33px;
      margin-bottom: 22px;
      max-width: 320px;
      @media (max-width: $tablet-l) {
        margin-bottom: 10px;
      }
      @media (max-width: $phone-l) {
        margin-inline: 10px;
        margin-bottom: 5px;
        max-width: 100%;
      }
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
:deep(
    .main-page__text-field-wrapper
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
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(2)),
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(3)),
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(4)) {
  max-width: 200px;
  @media (max-width: 899px) {
    max-width: none;
  }
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 80px;
  @media (max-width: 899px) {
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
