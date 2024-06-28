<template>
  <div v-if="!$route.meta.requiresAuth" class="app-header">
    <v-toolbar class="app-header" :elevation="7" color="var(--color-header-bg)">
      <div class="app-header__buttons">
        <v-btn
          variant="text"
          class="app-header__btn"
          :class="[
            isActive === ROUTES.SIGN_IN.NAME ? 'app-header__btn-active' : '',
          ]"
          @click="handleIsActive"
        >
          LOGIN
        </v-btn>
        <v-btn
          variant="text"
          class="app-header__btn"
          :class="[
            isActive === ROUTES.SIGN_UP.NAME ? 'app-header__btn-active' : '',
          ]"
          @click="handleIsActive"
        >
          SIGNUP
        </v-btn>
      </div>
    </v-toolbar>
  </div>
  <div v-else class="toolbar">
    <v-layout>
      <v-toolbar
        class="toolbar__wrapper"
        :elevation="7"
        color="var(--color-header-bg)"
      >
        <v-app-bar-nav-icon
          @click="handleNavigationShow"
          color="var(--color-text-red)"
        ></v-app-bar-nav-icon>

        <v-spacer></v-spacer>

        <v-icon style="color: #767676">mdi-web</v-icon>

        <div class="toolbar__language">
          <v-select :items="locations" v-model="location">
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="item.raw.value"></v-list-item>
            </template>
          </v-select>
        </div>

        <p v-if="user" class="toolbar__email">
          {{ `${user.firstName} ` + `${user.lastName}` }}
        </p>
        <v-skeleton-loader
          v-else
          type="text"
          width="130px"
          color="var(--color-header-bg)"
        ></v-skeleton-loader>
        <v-menu max-width="150px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="var(--color-text-red)" size="large">
                <v-img
                  v-if="user"
                  alt="Avatar"
                  :src="require(`@/assets/images/${user.avatar}`)"
                />
                <v-skeleton-loader v-else type="avatar"></v-skeleton-loader>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="d-flex flex-lg-column flex-sm-wrap">
              <v-btn
                v-if="user"
                prepend-icon="mdi-account-circle"
                variant="text"
                class="mb-1 pl-2"
                router
                :to="`${ROUTES.USERS.PATH}/${user.id}`"
              >
                Profile
              </v-btn>
              <v-btn
                prepend-icon="mdi-cog"
                variant="text"
                class="pl-2"
                router
                :to="`${ROUTES.SETTINGS.PATH}`"
              >
                Settings
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn
                @click="handleLogout"
                prepend-icon="mdi-logout"
                variant="text"
                class="pl-2"
              >
                Logout
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-toolbar>
      <v-navigation-drawer
        v-model="drawer"
        temporary
        color="var(--color-wrapper-bg)"
        floating
      >
        <div class="toolbar__navigation-close">
          <v-btn
            @click="handleNavigationShow"
            size="large"
            density="comfortable"
            icon="$close"
            variant="plain"
            color="var(--color-text-red)"
            class="mr-2"
            rounded="0"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-btn
          block
          rounded="0"
          class="text-subtitle-1 d-flex justify-start"
          size="x-large"
          variant="flat"
          color="var(--color-wrapper-bg)"
          router
          :to="ROUTES.USERS.NAME"
        >
          <v-icon size="x-large" class="mr-8 ml-4">mdi-home-outline</v-icon>
          Home
        </v-btn>
        <v-divider></v-divider>

        <v-list class="pa-0">
          <v-list-item
            class="pa-0"
            v-for="item in navigationItems"
            :key="item.title"
            router
            :to="item.link"
          >
            <v-btn
              block
              rounded="0"
              class="text-subtitle-1 d-flex justify-start"
              size="x-large"
              variant="flat"
              color="var(--color-wrapper-bg)"
              :class="[route.fullPath === item.link ? 'text-red-darken-4' : '']"
            >
              <v-icon size="x-large" class="mr-8 ml-4">{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ROUTES } from "@/constants/router";
import { useUsersStore } from "@/store/users";
import IUserData from "@/types/IUserData";
import { NAVIGATION__ITEMS } from "@/constants/navigationItems";
import { INavigationItem } from "@/types/INavigationItem";

const router = useRouter();
const route = useRoute();
const userStore = useUsersStore();

const locations = ref([
  { title: "EN", value: "English" },
  { title: "DE", value: "Deutsch" },
  { title: "RU", value: "Русский" },
]);

const location = ref<string>("English");

const user = ref<IUserData | undefined>(undefined);

const drawer = ref<boolean>(false);

const navigationItems: INavigationItem[] = NAVIGATION__ITEMS;

const isActive = computed(() => {
  return route.fullPath === ROUTES.SIGN_IN.PATH
    ? ROUTES.SIGN_IN.NAME
    : ROUTES.SIGN_UP.NAME;
});

const handleIsActive = () => {
  if (isActive.value === ROUTES.SIGN_IN.NAME) {
    router.push({ name: ROUTES.SIGN_UP.NAME });
  } else {
    router.push({ name: ROUTES.SIGN_IN.NAME });
  }
};

const handleNavigationShow = () => {
  drawer.value = !drawer.value;
};

const handleLogout = async (): Promise<void> => {
  // await authStore.logoutUser()
  // router.push("/signin");
  console.log("logout");
};

onMounted(() => {
  setTimeout(async (): Promise<void> => {
    user.value = await userStore.getUserById(1);
  }, 1000);
});
</script>

<style lang="scss" scopped>
.app-header {
  color: var(--color-header-text);
  &__buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    min-height: 48px;
    margin-top: auto;
    .app-header__btn {
      @include default-text(14px, 1.25);
      letter-spacing: normal;
      padding: 12px 16px;
      min-height: 48px;
      max-width: 150px;
      width: 100%;
      border-radius: 0;
      color: var(--color-btn-text);
      border-bottom: 2px solid var(--color-tab-btn-border);
    }
    .app-header__btn-active {
      color: var(--color-btn-bg);
      border-bottom: 2px solid var(--color-btn-bg);
    }
  }
}

.toolbar {
  color: var(--color-header-text);
  &__wrapper {
    padding: 0 20px;
  }
  &__language {
    height: 24px;
    margin: 0 48px 33px 0;
  }
  &__language > .v-select > .v-input__control > .v-field > .v-field__overlay {
    background-color: var(--color-header-bg);
  }
  &__language > .v-select > .v-input__control > .v-field > .v-field__outline {
    --v-field-border-width: 0;
    --v-field-border-opacity: 0;
  }
  &__language
    > .v-select
    > .v-input__control
    > .v-field
    > .v-field__outline::after {
    border-width: 0;
  }
  &__email {
    margin-right: 16px;
  }
  &__navigation-close {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: var(--color-header-bg);
    box-shadow: 0px 4px 5px -2px rgba(0, 0, 0, 0.2),
      0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12);
    margin-bottom: 16px;
  }
}
.toolbar > .v-layout > .v-navigation-drawer__scrim {
  opacity: 0.5;
}
</style>
