<template>
  <div class="global-container">
    <AppHeader />
    <main class="app-main" :style="{ paddingRight: scrollbarWidth }">
      <BreadCrumbs v-if="$route.meta.hasBreadcrumbs" />
      <AppTabs v-if="$route.meta.hasTabs" />
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import AppTabs from "@/components/AppTabs.vue";
import { storeToRefs } from "pinia";
import { useScrollbarWidth } from "@/store/scrollbarWidth";
import { useThemeStore } from "@/store/theme";
import { getThemeValue } from "@/utils/theme";

const { scrollbarWidth } = storeToRefs(useScrollbarWidth());

const { currTheme } = storeToRefs(useThemeStore());

function updateCurrTheme() {
  if (getThemeValue(currTheme.value) === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
}

updateCurrTheme();

watch(currTheme, updateCurrTheme);
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
}

.app-main {
  flex-grow: 1;
  padding: 10px 20px;
}
</style>
