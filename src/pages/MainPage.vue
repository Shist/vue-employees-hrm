<template>
  <div class="main-page">
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
      :items="employees"
      :search="search"
      :class="{ 'main-page__data-table': true }"
      hide-details
    >
      <template v-slot:[`item.avatar`]="{ item }">
        <v-img
          :src="require(`@/assets/images/${item.avatar}`)"
          class="main-page__table-img-avatar"
        />
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
            <v-list-item @click="() => openUserProfile(item)">
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
import { ref, reactive, Reactive } from "vue";
import { useBreadCrumbsStore } from "@/store/breadCrumbs";
import { useRouter } from "vue-router";
import IUserData from "@/types/IUserData";

const { breadcrumbsItems } = useBreadCrumbsStore();

const router = useRouter();

function openUserProfile(userData: IUserData) {
  breadcrumbsItems[1].disabled = false;

  breadcrumbsItems.push({
    crumbNum: 3,
    title: `${userData.firstName} ${userData.lastName}`,
    disabled: true,
    to: {
      path: `/users/${userData.id}`,
    },
  });

  router.push(`/users/${userData.id}`);
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
const employees: Reactive<IUserData[]> = reactive([
  {
    id: 1,
    avatar: "employee-1.png",
    firstName: "Pavel",
    lastName: "Zhukouski",
    email: "pavel.zhukouski@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 2,
    avatar: "employee-2.png",
    firstName: "Aliaksei",
    lastName: "Yuryeu",
    email: "aliaksei.yuryeu@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 1,
    avatar: "employee-1.png",
    firstName: "Pavel",
    lastName: "Zhukouski",
    email: "pavel.zhukouski@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 2,
    avatar: "employee-2.png",
    firstName: "Aliaksei",
    lastName: "Yuryeu",
    email: "aliaksei.yuryeu@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 1,
    avatar: "employee-1.png",
    firstName: "Pavel",
    lastName: "Zhukouski",
    email: "pavel.zhukouski@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 2,
    avatar: "employee-2.png",
    firstName: "Aliaksei",
    lastName: "Yuryeu",
    email: "aliaksei.yuryeu@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 1,
    avatar: "employee-1.png",
    firstName: "Pavel",
    lastName: "Zhukouski",
    email: "pavel.zhukouski@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 2,
    avatar: "employee-2.png",
    firstName: "Aliaksei",
    lastName: "Yuryeu",
    email: "aliaksei.yuryeu@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 1,
    avatar: "employee-1.png",
    firstName: "Pavel",
    lastName: "Zhukouski",
    email: "pavel.zhukouski@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 2,
    avatar: "employee-2.png",
    firstName: "Aliaksei",
    lastName: "Yuryeu",
    email: "aliaksei.yuryeu@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 1,
    avatar: "employee-1.png",
    firstName: "Pavel",
    lastName: "Zhukouski",
    email: "pavel.zhukouski@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
  {
    id: 2,
    avatar: "employee-2.png",
    firstName: "Aliaksei",
    lastName: "Yuryeu",
    email: "aliaksei.yuryeu@innowise.com",
    department: "Vue",
    position: "Vue Engineer",
  },
]);
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
}
:deep(.main-page__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
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
