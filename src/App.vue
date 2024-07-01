<template>
  <div
    class="global-container"
    :class="{ 'dark-theme': theme.global.name.value === 'appDark' }"
  >
    <AppHeader />
    <main class="app-main" :style="{ paddingRight: scrollbarWidth }">
      <BreadCrumbs v-if="$route.meta.hasBreadcrumbs" />
      <AppTabs v-if="$route.meta.hasTabs" />
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
import AppHeader from "@/components/AppHeader.vue";
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import AppTabs from "@/components/AppTabs.vue";
import { useScrollbarWidth } from "@/store/scrollbarWidth";
import { storeToRefs } from "pinia";

const { scrollbarWidth } = storeToRefs(useScrollbarWidth());

const theme = useTheme();
</script>

<style lang="scss" scoped>
@import "vue3-toastify/dist/index.css";

.Toastify__toast {
  cursor: default;
}
.Toastify__toast-body > div {
  cursor: text;
  font-family: $font-roboto;
  text-align: center;
  word-break: break-word;
}

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
