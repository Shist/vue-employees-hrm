<template>
  <div class="settings-page">
    <v-select
      v-model="selectTheme"
      :items="themeItems"
      label="Appearance"
      variant="outlined"
      class="settings-page__text-field-wrapper"
      hide-details
    />
    <v-select
      v-model="selectLanguage"
      :items="languageItems"
      label="Language"
      variant="outlined"
      class="settings-page__text-field-wrapper"
      hide-details
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const selectTheme = ref("Dark");
const themeItems = ["Light", "Dark", "Device settings"];

const selectLanguage = ref("English");
const languageItems = ["English", "Deutsch", "Русский"];
</script>

<style lang="scss" scoped>
.settings-page {
  margin: 0 auto;
  padding-block: 32px;
  max-width: 720px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

:deep(.settings-page__text-field-wrapper .v-field__outline__start) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.settings-page__text-field-wrapper .v-field__outline__end) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__start) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(.v-field--focused .v-field__outline__end) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
:deep(.settings-page__text-field-wrapper .v-field__outline__notch::before) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::before) {
  border-top: 1px solid var(--color-input-borders);
}
:deep(.settings-page__text-field-wrapper .v-field__outline__notch::after) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::after) {
  border-bottom: 1px solid var(--color-input-borders);
}
:deep(.settings-page__text-field-wrapper .v-field-label) {
  transition: background-color 0.3s;
}
:deep(.v-field--focused .v-field-label) {
  color: var(--color-active-text);
}
</style>
