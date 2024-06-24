<template>
  <div class="global-container" :class="{ 'dark-theme': currTheme === 'dark' }">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const currTheme = ref("dark");
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
</style>
