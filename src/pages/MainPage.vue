<template>
  <div class="main-page">
    <BreadCrumbs />
    <ExampleComponent />
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from "@/components/BreadCrumbs.vue";
import ExampleComponent from "@/components/ExampleComponent.vue";
</script>

<style lang="scss" scoped>
.main-page {
  flex-grow: 1;
}
</style>
