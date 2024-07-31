<template>
  <div class="global-container" v-if="!isLoading">
    <AppHeader />
    <AppSpinner v-if="isLogging" class="global-container__spinner" />
    <main v-else class="app-main" :style="{ paddingRight: scrollbarWidth }">
      <div class="app-main__content-wrapper">
        <BreadCrumbs v-if="$route.meta.hasBreadcrumbs" />
        <AppTabs v-if="$route.meta.hasTabs" />
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useScrollbarWidth } from "@/store/scrollbarWidth";
import { useThemeStore } from "@/store/theme";
import { useLangStore } from "@/store/lang";
import { useTheme } from "vuetify";
import { updateGlobalOptions } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import AppHeader from "@/components/AppHeader.vue";
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import AppTabs from "@/components/AppTabs.vue";
import { getThemeValue } from "@/utils/theme";

const { scrollbarWidth } = storeToRefs(useScrollbarWidth());

const { currTheme } = storeToRefs(useThemeStore());

const authStore = useAuthStore();
const langStore = useLangStore();

const vuetifyTheme = useTheme();

const { locale } = useI18n({ useScope: "global" });

const isLogging = ref(true);

const isLoading = ref(true);

function setCurrTheme() {
  localStorage.setItem("theme", currTheme.value);

  const themeValue = getThemeValue(currTheme.value);

  if (themeValue === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }

  vuetifyTheme.global.name.value = themeValue;

  updateGlobalOptions({
    clearOnUrlChange: false,
    theme: themeValue,
  });
}

setCurrTheme();

function setCurrLang() {
  document.querySelector("html")?.setAttribute("lang", locale.value);
}

setCurrLang();

watch(currTheme, setCurrTheme);

function onDeviceSettingsUpdate() {
  if (currTheme.value === "Device settings") {
    setCurrTheme();
  }
}

onMounted(async () => {
  await langStore.loadInitialLocale(locale.value).finally(() => {
    isLoading.value = false;
  });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onDeviceSettingsUpdate);

  authStore.fetchUserAuthData().finally(() => {
    isLogging.value = false;
  });
});

onUnmounted(() => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.removeEventListener("change", onDeviceSettingsUpdate);
});
</script>

<style lang="scss">
.global-container {
  position: relative;
  min-height: 100vh;
  max-width: 1920px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background-color: var(--color-wrapper-bg);
  font-family: $font-roboto;
  &__spinner {
    margin-top: 132px;
    align-self: center;
  }
}

.app-main {
  flex-grow: 1;
  &__content-wrapper {
    padding: 10px 20px;
    @media (max-width: $tablet-l) {
      padding: 10px;
    }
  }
}
</style>
