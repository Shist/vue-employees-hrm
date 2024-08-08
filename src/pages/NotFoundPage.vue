<template>
  <div class="not-found-page">
    <h1 class="not-found-page__headline">
      {{ $t("errors.notFoundPageTitle") }}
    </h1>
    <router-link to="/" class="not-found-page__link-to-main">
      {{ $t("errors.backToMainPage") }}
    </router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.not-found-page {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 20px;
  &__headline {
    @include default-headline(48px, 48px);
    color: var(--color-text);
  }
  &__link-to-main {
    @include default-text(36px, 36px);
    color: var(--color-text);
    transition: 0.3s;
    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>
