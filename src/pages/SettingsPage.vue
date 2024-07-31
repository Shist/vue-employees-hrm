<template>
  <div class="settings-page">
    <v-select
      v-model="selectTheme"
      :items="themeItems"
      :label="$t('label.theme')"
      variant="outlined"
      class="settings-page__text-field-wrapper"
      hide-details
    />
    <v-select
      v-model="selectLanguage"
      :items="languageItems"
      :label="$t('label.language')"
      variant="outlined"
      class="settings-page__text-field-wrapper"
      hide-details
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/store/theme";
import { useLangStore } from "@/store/lang";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({ useScope: "global" });

const { currTheme } = storeToRefs(useThemeStore());

const langStore = useLangStore();
const currLang = storeToRefs(langStore).currLang;

const selectTheme = ref(currTheme.value);

const themeItems = computed(() => {
  return [
    { title: t("theme.Light"), value: "Light" },
    { title: t("theme.Dark"), value: "Dark" },
    { title: t("theme.Device settings"), value: "Device settings" },
  ];
});

const selectLanguage = ref(currLang.value);

const languageItems = ["English", "Deutsch", "Русский"];

watch(selectTheme, (newValue) => {
  currTheme.value = newValue;
});

watch(selectLanguage, async (newLocale) => {
  await langStore.changeCurrLanguage(newLocale);
});

watch(locale, (newValue) => {
  if (newValue) {
    selectLanguage.value = currLang.value;
  }
});
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
