<template>
  <div class="error-wrapper">
    <h4 class="error-wrapper__message">
      ❌ {{ $t(`errors.${errorMessageKey}`) }}
    </h4>
    <v-btn
      v-if="isNotFoundError"
      class="error-wrapper__back-to-main-btn"
      router
      :to="ROUTES.USERS.PATH"
    >
      {{ $t("errors.backToMainPage") }}
    </v-btn>
    <span v-if="!isNotFoundError" class="error-wrapper__try-to-reload-label">
      {{ $t("errors.reloadPage") }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent } from "vue";
import { ROUTES } from "@/constants/router";

defineComponent({
  name: "AppErrorSection",
});

const props = defineProps<{
  errorMessageKey: string;
}>();

const isNotFoundError = computed(
  () =>
    props.errorMessageKey === "NOT_FOUND_USER" ||
    props.errorMessageKey === "NOT_FOUND_CV"
);
</script>

<style scoped lang="scss">
.error-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  &__message {
    @include default-text(26px, 32px);
    color: var(--color-text);
    text-align: center;
    @media (max-width: $phone-l) {
      font-size: 22px;
      line-height: 28px;
    }
  }
  &__back-to-main-btn {
    color: var(--color-btn-text);
    background-color: var(--color-btn-bg);
    border-radius: 0;
    &:hover {
      background-color: var(--color-btn-bg-hover);
    }
  }
  &__try-to-reload-label {
    @include default-text(20px, 26px);
    color: var(--color-text);
    text-align: center;
    @media (max-width: $phone-l) {
      font-size: 18px;
      line-height: 24px;
    }
  }
}
</style>
