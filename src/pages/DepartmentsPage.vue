<template>
  <div class="departments-page">
    <AppErrorSection
      v-if="isError"
      :errorMessageKey="errorMessageKey"
      class="departments-page__error-wrapper"
    />
    <div v-else class="departments-page__main-content-wrapper">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        single-line
        :placeholder="$t('placeholder.search')"
        class="departments-page__text-field-wrapper"
        hide-details
      />
      <v-skeleton-loader type="table" :loading="isLoading">
        <v-data-table
          :headers="headers"
          :items="departments"
          :search="search"
          :custom-filter="handleTableFilter"
          :no-data-text="$t('departmentsPage.noDepartments')"
          class="departments-page__data-table"
          hide-details
        >
          <template v-slot:[`item.options`]>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  v-bind="props"
                  class="departments-page__popup-menu-btn"
                ></v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="departmentItem in departmentMenuItems"
                  :key="departmentItem"
                  disabled
                >
                  <v-list-item-title class="departments-page__popup-menu-label">
                    {{ departmentItem }}
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
import { getAllDepartmentNames } from "@/services/departments";
import { IDepartmentsTableData } from "@/types/pages/departmentsTable";
import { IDepartmentsFilterFunction } from "@/types/vuetifyDataTable";

const { t } = useI18n({ useScope: "global" });

const search = ref("");

const departments = reactive<IDepartmentsTableData[]>([]);

const headers = computed(() => {
  return [
    { key: "name", title: t(`departmentsPage.name`) },
    { key: "options", sortable: false },
  ];
});

const departmentMenuItems = computed(() => {
  return [
    t(`departmentsPage.updateDepartment`),
    t(`departmentsPage.deleteDepartment`),
  ];
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
    const departmentsData = await getAllDepartmentNames();

    departments.splice(0, departments.length, ...departmentsData);

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
});

const handleTableFilter: IDepartmentsFilterFunction = (value, query, item) => {
  if (!item) return false;
  return item.raw.name.toLowerCase().includes(query.toLowerCase());
};
</script>

<style lang="scss" scoped>
.departments-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__error-wrapper {
    padding-top: 64px;
  }
  &__main-content-wrapper {
    align-self: stretch;
    .departments-page__text-field-wrapper {
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
    .departments-page__data-table {
      background-color: var(--color-wrapper-bg);
    }
    .departments-page__popup-menu-btn {
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .departments-page__popup-menu-label {
      font-family: $font-roboto;
    }
  }
}
:deep(.departments-page__text-field-wrapper .v-field__outline__start) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.departments-page__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(
    .departments-page__text-field-wrapper
      .v-field--active
      .v-field__outline__start
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(
    .departments-page__text-field-wrapper
      .v-field--active
      .v-field__outline__end
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
:deep(
    .departments-page__text-field-wrapper
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
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:first-child) {
  max-width: 200px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 80px;
}
</style>
