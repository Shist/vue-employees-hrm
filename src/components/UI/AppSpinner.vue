<template>
  <v-progress-circular
    :size="100"
    :width="10"
    color="var(--color-spinner)"
    indeterminate
  />
</template>

<script setup lang="ts">
import { defineComponent } from "vue";

defineComponent({
  name: "AppSpinner",
});
</script>

<style scoped></style>
