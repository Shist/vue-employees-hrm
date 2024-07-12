<template>
  <div class="cvs-page">
    <AppSpinner v-if="isLoading" class="cvs-page__spinner" />
    <AppErrorSection
      v-else-if="isError"
      :errorMessage="errorMessage"
      class="cvs-page__error-wrapper"
    />
    <div v-else class="cvs-page__main-content-wrapper">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        single-line
        density="compact"
        placeholder="Search"
        class="cvs-page__text-field-wrapper"
      />
      <v-data-table
        :headers="headers"
        :items="cvs"
        :search="search"
        class="cvs-page__data-table"
        item-key="name"
      >
        <template v-slot:[`item.options`]="{ item }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                v-bind="props"
                class="cvs-page__popup-menu-btn"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="cvItem in cvMenuItems"
                :key="cvItem.title"
                v-on:click="cvItem.click(item.id)"
              >
                <v-list-item-title class="cvs-page__popup-menu-label">
                  {{ cvItem.title }}
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
import useErrorState from "@/composables/useErrorState";
import { ROUTES } from "@/constants/router";
import { getAllCvs } from "@/services/cvs";
import { ICvsTableData } from "@/types/cvsTableUI";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function openCvDetails(cvID: number) {
  router.push(`${ROUTES.CVS.PATH}/${cvID}`);
}

function deleteCvByID(cvID: number) {
  console.log(`delete cv with id ${cvID}`);
}

const search = ref("");

const headers = [
  { key: "name", title: "Name" },
  { key: "description", title: "Description", sortable: false },
  { key: "email", title: "Employee" },
  { key: "options", sortable: false },
];

const {
  isLoading,
  isError,
  errorMessage,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const cvMenuItems = [
  { title: "Details", click: openCvDetails },
  { title: "Delete CV", click: deleteCvByID },
];

const cvs = reactive<ICvsTableData[]>([]);

onMounted(async () => {
  isLoading.value = true;

  try {
    const cvsData = await getAllCvs();

    cvs.splice(0, cvs.length, ...cvsData);

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.cvs-page {
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
    .cvs-page__text-field-wrapper {
      margin-left: 20px;
      max-width: 320px;
    }
    .cvs-page__data-table {
      background-color: var(--color-wrapper-bg);
    }
    .cvs-page__popup-menu-btn {
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
    .cvs-page__popup-menu-label {
      font-family: $font-roboto;
    }
  }
}
:deep(.cvs-page__text-field-wrapper .v-field__outline__start) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.cvs-page__text-field-wrapper .v-field__outline__end) {
  transition: 0.3s;
  border-radius: 0;
}
:deep(.cvs-page__text-field-wrapper .v-field--active .v-field__outline__start) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(.cvs-page__text-field-wrapper .v-field--active .v-field__outline__end) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  font-family: $font-roboto;
  font-size: 14px;
  line-height: 1.4;
  padding: 12px 16px;
  margin-left: auto;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  font-family: $font-roboto;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.013em;
  padding: 12px 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:first-child) {
  max-width: 120px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(2)) {
  max-width: 200px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  max-width: 20px;
}
</style>
