<template>
  <div class="error-wrapper">
    <h4 class="error-wrapper__message">❌ {{ errorMessage }}</h4>
    <v-btn
      v-if="isNotFoundError"
      class="error-wrapper__back-to-main-btn"
      router
      :to="ROUTES.USERS.PATH"
    >
      Back to the main page
    </v-btn>
    <span v-if="!isNotFoundError" class="error-wrapper__try-to-reload-label">
      Please try to reload the page
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ROUTES } from "@/constants/router";

defineComponent({
  name: "AppErrorSection",
});

defineProps<{
  errorMessage: string;
  isNotFoundError: boolean;
}>();
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
  }
}
</style>
