<template>
  <div
    class="global-container"
    :class="{ 'dark-theme': theme.global.name.value === 'appDark' }"
  >
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
import AppHeader from "@/components/AppHeader.vue";

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
</style>
