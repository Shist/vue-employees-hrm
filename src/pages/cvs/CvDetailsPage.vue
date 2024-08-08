<template>
  <div class="cv-details">
    <AppSpinner v-if="isLoading" />
    <AppErrorSection v-else-if="isError" :errorMessageKey="errorMessageKey" />
    <form v-else class="cv-details__main-content-wrapper">
      <v-text-field
        v-model="cvName"
        :label="$t('label.name')"
        variant="outlined"
        class="cv-details__text-field-wrapper"
        :readonly="!isOwner"
        hide-details
      />
      <v-text-field
        v-model="cvEducation"
        :label="$t('label.education')"
        variant="outlined"
        class="cv-details__text-field-wrapper"
        :readonly="!isOwner"
        hide-details
      />
      <v-textarea
        v-model="cvDescription"
        :label="$t('label.description')"
        variant="outlined"
        class="cv-details__text-field-wrapper"
        :readonly="!isOwner"
        no-resize
        hide-details
      />
      <v-btn
        v-if="isOwner"
        type="submit"
        class="cv-details__form-submit-btn"
        @click.prevent="submitCvDetailsUpdate"
        :disabled="isUpdateBtnDisabled"
      >
        {{ $t("button.updateButton") }}
      </v-btn>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useBreadCrumbsStore } from "@/store/breadCrumbs";
import useErrorState from "@/composables/useErrorState";
import { getCvDetailsDataById, updateCv } from "@/services/cvs/details";
import { IUpdateCvInput } from "@/types/cvsOperations";
import { ICvDetailsServerData } from "@/types/pages/cvs/details";

const route = useRoute();

const cvId = computed<string>(() => {
  // eslint-disable-next-line
  const [section, cvId, tab] = route.fullPath.slice(1).split("/");
  return cvId;
});

const {
  isLoading,
  isError,
  errorMessageKey,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const cvNameInitial = ref<string | null>(null);
const cvEducationInitial = ref<string | null>(null);
const cvDescriptionInitial = ref<string | null>(null);

const cvName = ref<string | null>(null);
const cvEducation = ref<string | null>(null);
const cvDescription = ref<string | null>(null);
const cvUserId = ref<string | null>(null);

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === cvUserId.value);

const { newEnityName } = storeToRefs(useBreadCrumbsStore());

const isUpdateBtnDisabled = computed(
  () =>
    !cvName.value ||
    !cvDescription.value ||
    (cvNameInitial.value === cvName.value &&
      cvEducationInitial.value === cvEducation.value &&
      cvDescriptionInitial.value === cvDescription.value)
);

onMounted(() => {
  fetchData();
});

function updateCvDetailsValue(cvDetailsData: ICvDetailsServerData) {
  cvNameInitial.value = cvDetailsData.name;
  cvEducationInitial.value = cvDetailsData.education;
  cvDescriptionInitial.value = cvDetailsData.description;

  cvName.value = cvNameInitial.value;
  cvEducation.value = cvEducationInitial.value;
  cvDescription.value = cvDescriptionInitial.value;

  if (cvDetailsData.user) {
    cvUserId.value = cvDetailsData.user.id;
  }
}

function fetchData() {
  isLoading.value = true;

  getCvDetailsDataById(cvId.value)
    .then((cvDetailsData) => {
      if (!cvDetailsData) return;

      updateCvDetailsValue(cvDetailsData);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function submitCvDetailsUpdate() {
  if (!isOwner.value) return;

  const cvInputObj: IUpdateCvInput = {
    cvId: Number(cvId.value),
    name: `${cvName.value}`,
    education: cvEducation.value,
    description: `${cvDescription.value}`,
  };

  isLoading.value = true;

  updateCv(cvInputObj)
    .then((freshCvDetails) => {
      if (!freshCvDetails) return;

      updateCvDetailsValue(freshCvDetails);

      newEnityName.value = freshCvDetails.name;

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}
</script>

<style lang="scss" scoped>
.cv-details {
  margin: 0 auto;
  padding: 32px 24px;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: $tablet-l) {
    padding: 20px 10px;
  }
  &__main-content-wrapper {
    position: relative;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 52px;
    .cv-details__form-submit-btn {
      color: var(--color-btn-text);
      background-color: var(--color-btn-bg);
      border-radius: 0;
      &:hover {
        background-color: var(--color-btn-bg-hover);
      }
      &:disabled {
        filter: grayscale(50%);
      }
    }
  }
}

:deep(.cv-details__text-field-wrapper .v-field__outline__start) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.cv-details__text-field-wrapper .v-field__outline__end) {
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
:deep(.cv-details__text-field-wrapper .v-field__outline__notch::before) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::before) {
  border-top: 1px solid var(--color-input-borders);
}
:deep(.cv-details__text-field-wrapper .v-field__outline__notch::after) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::after) {
  border-bottom: 1px solid var(--color-input-borders);
}
:deep(.cv-details__text-field-wrapper .v-field-label) {
  transition: background-color 0.3s;
}
:deep(.v-field--focused .v-field-label) {
  color: var(--color-active-text);
}
</style>
