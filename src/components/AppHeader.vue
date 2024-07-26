<template>
  <div v-if="$route.meta.notFound" class="empty-header"></div>
  <div v-else-if="!$route.meta.requiresAuth" class="app-header">
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
          {{ $t("appHeader.btnLogin") }}
        </v-btn>
        <v-btn
          variant="text"
          class="app-header__btn"
          :class="[
            isActive === ROUTES.SIGN_UP.NAME ? 'app-header__btn-active' : '',
          ]"
          @click="handleIsActive"
        >
          {{ $t("appHeader.btnSignup") }}
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
        :style="{ paddingRight: scrollbarWidth }"
      >
        <v-app-bar-nav-icon
          @click="handleNavigationShow"
          color="var(--color-text-red)"
        />
        <v-spacer />
        <v-select
          variant="plain"
          :items="languages"
          v-model="language"
          class="toolbar__select-lang text-white"
          hide-details
        >
          <template v-slot:prepend-inner>
            <v-icon style="color: #767676; margin-right: 5px">mdi-web</v-icon>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="item.value" />
          </template>
        </v-select>
        <p v-if="user?.email" class="toolbar__email text-white">
          {{ userHeaderName }}
        </p>
        <v-skeleton-loader
          v-else
          type="text"
          width="130px"
          color="var(--color-header-bg)"
        />
        <v-menu max-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="var(--color-text-red)" size="default">
                <v-img
                  v-if="user?.avatar"
                  alt="Avatar"
                  :src="user.avatar || undefined"
                />
                <p v-else-if="user?.email" class="toolbar__name">
                  {{ userInitials }}
                </p>
                <v-skeleton-loader v-else type="avatar" />
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text v-if="user" class="d-flex flex-column align-start">
              <v-btn
                v-for="item in profileMenu"
                :key="item.title"
                :prepend-icon="item.icon"
                variant="text"
                class="mb-1 pl-2 w-100 justify-start"
                router
                :to="
                  item.title === $t(`appHeader.btnProfile`)
                    ? `${item.link}/${user.id}`
                    : item.link
                "
              >
                {{ item.title }}
              </v-btn>
              <v-divider class="my-2 grey-lighten-1 w-100" />
              <v-btn
                @click="handleLogout"
                prepend-icon="mdi-logout"
                variant="text"
                class="pl-2 w-100 justify-start"
              >
                {{ $t("appHeader.btnLogout") }}
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
          :to="ROUTES.USERS.PATH"
        >
          <v-icon size="x-large" class="mr-8 ml-4">mdi-home-outline</v-icon>
          {{ $t("navigation.Home") }}
        </v-btn>
        <v-divider />
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
              :class="[
                route.fullPath.startsWith(item.link) ? 'text-red-darken-4' : '',
              ]"
            >
              <v-icon size="x-large" class="mr-8 ml-4">{{ item.icon }}</v-icon>
              {{ $t(`navigation.${item.title}`) }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/store/authStore";
import { useLangStore } from "@/store/lang";
import { useScrollbarWidth } from "@/store/scrollbarWidth";
import handleScrollPadding from "@/utils/handleScrollPadding";
import { ROUTES } from "@/constants/router";
import { NAVIGATION__ITEMS } from "@/constants/navigationItems";
import { INavigationItem } from "@/types/navigation";

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const user = storeToRefs(authStore).user;

const langStore = useLangStore();
const currLang = storeToRefs(langStore).currLang;

const { t, locale } = useI18n({ useScope: "global" });

const { scrollbarWidth } = storeToRefs(useScrollbarWidth());

const languages = ref([
  { title: "EN", value: "English" },
  { title: "DE", value: "Deutsch" },
  { title: "RU", value: "Русский" },
]);

const profileMenu = computed(() => {
  return [
    {
      title: t(`appHeader.btnProfile`),
      link: ROUTES.USERS.PATH,
      icon: "mdi-account-circle",
    },
    {
      title: t(`appHeader.btnSettings`),
      link: ROUTES.SETTINGS.PATH,
      icon: "mdi-cog",
    },
  ];
});

const language = ref<string>(currLang.value);

const drawer = ref<boolean>(false);

const navigationItems: INavigationItem[] = NAVIGATION__ITEMS;

const userInitials = computed(() => {
  if (user.value?.fullName) {
    return user.value.fullName.charAt(0).toUpperCase();
  }
  return user.value?.email.charAt(0).toUpperCase();
});

const userHeaderName = computed(() => {
  if (user.value?.fullName) return user.value.fullName;
  return user.value?.email;
});

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

const handleLogout = (): void => {
  authStore.logout();
};

watch(drawer, (newValue) => {
  handleScrollPadding(newValue);
});

watch(language, async (newLocale) => {
  await langStore.changeCurrLanguage(newLocale);
});

watch(locale, (newValue) => {
  if (newValue) {
    language.value = currLang.value;
  }
});
</script>

<style lang="scss" scopped>
.empty-header {
  height: 64px;
  background-color: var(--color-header-bg);
  box-shadow: 0px 4px 5px -2px rgba(0, 0, 0, 0.2),
    0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12);
}

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
    @media (max-width: $phone-l) {
      padding: 0;
    }
  }
  &__select-lang {
    margin-right: 20px;
    max-width: 85px;
    @media (max-width: $phone-l) {
      margin-right: 10px;
    }
    @media (max-width: $phone-m) {
      margin-right: 5px;
    }
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
    max-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    @media (max-width: $phone-l) {
      max-width: 120px;
      font-size: 14px;
    }
  }
  &__name {
    font-size: 20px;
    color: var(--color-header-bg);
    max-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    @media (max-width: $phone-l) {
      max-width: 120px;
      font-size: 14px;
    }
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
.toolbar__select-lang > .v-input__control > .v-field > .v-field__prepend-inner,
.toolbar__select-lang > .v-input__control > .v-field > .v-field__append-inner {
  padding-block: 20px;
}
.toolbar__select-lang
  > .v-input__control
  > .v-field
  > .v-field__field
  > .v-field__input {
  padding: 20px 0;
  justify-content: flex-end;
}
</style>
