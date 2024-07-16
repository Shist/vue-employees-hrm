<template>
  <div class="positions-page">
    <AppSpinner v-if="isLoading" class="positions-page__spinner" />
    <AppErrorSection
      v-else-if="isError"
      :errorMessage="errorMessage"
      class="positions-page__error-wrapper"
    />
    <div v-else class="positions-page__main-content-wrapper">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        single-line
        placeholder="Search"
        class="positions-page__text-field-wrapper"
      />
      <v-data-table
        :headers="headers"
        :items="positions"
        :search="search"
        :custom-filter="handleTableFilter"
        item-key="id"
        class="positions-page__data-table"
        hide-details
      >
        <template v-slot:[`item.options`]>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                v-bind="props"
                class="positions-page__popup-menu-btn"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="positionItem in positionMenuItems"
                :key="positionItem"
                disabled
              >
                <v-list-item-title class="positions-page__popup-menu-label">
                  {{ positionItem }}
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
import { getAllPositionNames } from "@/services/positions";
import { IPositionsTableData } from "@/types/positionsTableUI";
import { IPositionsFilterFunction } from "@/types/vuetifyDataTable";

const search = ref("");

const positions = reactive<IPositionsTableData[]>([]);

const headers = [
  { key: "name", title: "Name" },
  { key: "options", sortable: false },
];

const positionMenuItems = ["Update Position", "Delete Position"];

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
    const positionsData = await getAllPositionNames();

    positions.splice(0, positions.length, ...positionsData);

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
});

const handleTableFilter: IPositionsFilterFunction = (value, query, item) => {
  if (!item) return false;
  return item.raw.name.toLowerCase().includes(query.toLowerCase());
};
</script>

<style lang="scss" scoped>
.positions-page {
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
    .positions-page__text-field-wrapper {
      margin-left: 33px;
      max-width: 320px;
    }
    .positions-page__data-table {
      background-color: var(--color-wrapper-bg);
    }
    .positions-page__popup-menu-btn {
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .positions-page__popup-menu-label {
      font-family: $font-roboto;
    }
  }
}
:deep(.positions-page__text-field-wrapper .v-field__outline__start) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.positions-page__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(
    .positions-page__text-field-wrapper
      .v-field--active
      .v-field__outline__start
  ) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(
    .positions-page__text-field-wrapper .v-field--active .v-field__outline__end
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
:deep(.v-table > .v-table__wrapper > table > thead > tr > th:last-child) {
  width: 80px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 80px;
}
</style>
