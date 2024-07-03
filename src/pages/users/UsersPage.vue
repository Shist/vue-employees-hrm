<template>
  <div class="main-page" v-if="!isLoading">
    <v-text-field
      v-model="search"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      single-line
      class="main-page__text-field-wrapper"
    >
    </v-text-field>
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "@/constants/router";
import IUserData from "@/types/IUserData";
import { getAllUsers } from "@/services/users";

const router = useRouter();

function openUserProfile(userId: number) {
  router.push(`${ROUTES.USERS.PATH}/${userId}`);
}

const search = ref("");

const headers = reactive([
  { key: "avatar", sortable: false },
  { key: "firstName", title: "First Name" },
  { key: "lastName", title: "Last Name" },
  { key: "email", title: "Email" },
  { key: "department", title: "Department" },
  { key: "position", title: "Position" },
  { key: "options", sortable: false },
]);

const isLoading = ref<boolean>(false);
const users = reactive<IUserData[]>([]);

onMounted(async () => {
  isLoading.value = true;
  const userData = await getAllUsers();
  users.splice(0, users.length, ...(userData as []));
  isLoading.value = false;
});
</script>

<style lang="scss" scoped>
.main-page {
  &__text-field-wrapper {
    margin-left: 20px;
    max-width: 320px;
  }
  &__data-table {
    background-color: var(--color-wrapper-bg);
  }
  &__table-img-avatar {
    margin: 10px;
    border-radius: 50%;
    height: 50px;
    width: 50px;
  }
  &__popup-menu-btn {
    background-color: var(--color-wrapper-bg);
    box-shadow: none;
  }
  &__popup-menu-label {
    font-family: $font-roboto;
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
</style>
