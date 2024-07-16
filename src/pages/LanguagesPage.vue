<template>
  <div class="languages-page">
    <AppSpinner v-if="isLoading" class="languages-page__spinner" />
    <AppErrorSection
      v-else-if="isError"
      :errorMessage="errorMessage"
      class="languages-page__error-wrapper"
    />
    <div v-else class="languages-page__main-content-wrapper">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        single-line
        placeholder="Search"
        class="languages-page__text-field-wrapper"
      />
      <v-data-table
        :headers="headers"
        :items="languages"
        :search="search"
        :custom-filter="handleTableFilter"
        item-key="id"
        class="languages-page__data-table"
        hide-details
      >
        <template v-slot:[`item.options`]>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                v-bind="props"
                class="languages-page__popup-menu-btn"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="languagetItem in languageMenuItems"
                :key="languagetItem"
                disabled
              >
                <v-list-item-title class="languages-page__popup-menu-label">
                  {{ languagetItem }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import useErrorState from "@/composables/useErrorState";
import { getAllLanguages } from "@/services/languages";
import { ILanguagesTableData } from "@/types/languagesTableUI";
import { ILanguagesFilterFunction } from "@/types/vuetifyDataTable";

const search = ref("");

const languages = reactive<ILanguagesTableData[]>([]);

const headers = [
  { key: "name", title: "Name" },
  { key: "nativeName", title: "Native Name", sortable: false },
  { key: "iso2", title: "ISO2", sortable: false },
  { key: "options", sortable: false },
];

const languageMenuItems = ["Update Language", "Delete Language"];

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

onMounted(async () => {
  isLoading.value = true;

  try {
    const languagesData = await getAllLanguages();

    languages.splice(
      0,
      languages.length,
      ...languagesData.map((language) => ({
        id: language.id,
        name: language.name,
        nativeName: language.native_name,
        iso2: language.iso2,
      }))
    );

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
});

const handleTableFilter: ILanguagesFilterFunction = (value, query, item) => {
  if (!item) return false;
  return item.raw.name.toLowerCase().includes(query.toLowerCase());
};
</script>

<style lang="scss" scoped>
.languages-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__spinner {
    margin-top: 64px;
  }
  &__error-wrapper {
    padding-top: 64px;
  }
  &__main-content-wrapper {
    align-self: stretch;
    .languages-page__text-field-wrapper {
      margin-left: 33px;
      max-width: 320px;
    }
    .languages-page__data-table {
      background-color: var(--color-wrapper-bg);
    }
    .languages-page__popup-menu-btn {
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .languages-page__popup-menu-label {
      font-family: $font-roboto;
    }
  }
}
:deep(.languages-page__text-field-wrapper .v-field__outline__start) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.languages-page__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(
    .languages-page__text-field-wrapper
      .v-field--active
      .v-field__outline__start
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(
    .languages-page__text-field-wrapper .v-field--active .v-field__outline__end
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  padding: 12px 16px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  padding: 12px 16px;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr > th:nth-child(3)) {
  width: 400px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(3)) {
  width: 400px;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr > th:last-child) {
  width: 80px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 80px;
}
</style>
