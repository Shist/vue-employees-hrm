<template>
  <div class="languages-page">
    <AppErrorSection
      v-if="isError"
      :errorMessageKey="errorMessageKey"
      class="languages-page__error-wrapper"
    />
    <div v-else class="languages-page__main-content-wrapper">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        single-line
        :placeholder="$t('placeholder.search')"
        class="languages-page__text-field-wrapper"
        hide-details
      />
      <v-skeleton-loader type="table" :loading="isLoading">
        <v-data-table
          :headers="headers"
          :items="languages"
          :search="search"
          :custom-filter="handleTableFilter"
          :mobile="null"
          :mobile-breakpoint="600"
          :no-data-text="$t('languagesPage.noLanguages')"
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
      </v-skeleton-loader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import useErrorState from "@/composables/useErrorState";
import { getAllLanguages } from "@/services/languages";
import { ILanguagesTableData } from "@/types/pages/languagesTable";
import { ILanguagesFilterFunction } from "@/types/vuetifyDataTable";

const { t } = useI18n({ useScope: "global" });

const search = ref("");

const languages = reactive<ILanguagesTableData[]>([]);

const headers = computed(() => {
  return [
    { key: "name", title: t(`languagesPage.name`) },
    {
      key: "nativeName",
      title: t(`languagesPage.nativeName`),
      sortable: false,
    },
    { key: "iso2", title: "ISO2", sortable: false },
    { key: "options", sortable: false },
  ];
});

const languageMenuItems = computed(() => {
  return [t(`languagesPage.updateLanguage`), t(`languagesPage.deleteLanguage`)];
});

const {
  isLoading,
  isError,
  errorMessageKey,
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
  &__error-wrapper {
    padding-top: 64px;
  }
  &__main-content-wrapper {
    align-self: stretch;
    .languages-page__text-field-wrapper {
      margin-left: 33px;
      margin-bottom: 22px;
      max-width: 320px;
      @media (max-width: $tablet-l) {
        margin-bottom: 10px;
      }
      @media (max-width: $phone-l) {
        margin-inline: 10px;
        margin-bottom: 5px;
        max-width: 100%;
      }
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
:deep(
    .languages-page__text-field-wrapper
      .v-field--active
      .v-field__prepend-inner
      .v-icon
  ) {
  opacity: 1;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  padding: 12px 16px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  padding: 12px 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(1)),
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(2)),
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(3)) {
  max-width: 150px;
  @media (max-width: 599px) {
    max-width: none;
  }
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 80px;
  @media (max-width: 599px) {
    width: 100%;
  }
}
</style>
