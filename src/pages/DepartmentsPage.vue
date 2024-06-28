<template>
  <h2 class="page-headline">This is Departments page</h2>
  <h3 class="page-headline-dev">This page is now under development...</h3>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.page-headline {
  @include default-headline(36px, 36px);
  padding: 20px;
}
.page-headline-dev {
  @include default-headline(32px, 32px);
  padding: 20px;
}
</style>
