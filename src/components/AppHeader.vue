<template>
  <header class="app-header">
    <h2 class="app-header__headline">This is app header</h2>
  </header>
</template>

<script setup lang="ts"></script>

<style lang="scss" scopped>
.app-header {
  min-height: 64px;
  background-color: var(--color-header-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  &__headline {
    @include default-headline(32px, 32px);
    color: var(--color-header-text);
  }
}
</style>
