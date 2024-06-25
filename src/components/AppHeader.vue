<template>
  <div class="app-header">
    <div class="app-header__buttons">
      <v-btn
        variant="text"
        class="app-header__btn"
        :class="[isActive === 'login' ? 'app-header__btn-active' : '']"
        @click="handleIsActive('login')"
      >
        LOGIN
      </v-btn>
      <v-btn
        variant="text"
        class="app-header__btn"
        :class="[isActive === 'signup' ? 'app-header__btn-active' : '']"
        @click="handleIsActive('signup')"
      >
        SIGNUP
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isActive = ref<string>("login");

const handleIsActive = (page: string) => {
  isActive.value = page;
};
</script>

<style lang="scss" scopped>
.app-header {
  min-height: 64px;
  background-color: var(--color-header-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  &__headline {
    @include default-headline(32px, 32px);
  }
  &__buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    min-height: 48px;
    margin-top: auto;
    .app-header__btn {
      @include default-text(0.875rem, 1.25);
      padding: 12px 16px;
      min-height: 48px;
      max-width: 150px;
      width: 100%;
      border-radius: 0;
      color: var(--color-btn-text);
      border-bottom: 2px solid var(--color-tab-btn-border);
    }
    .app-header__btn-active {
      color: var(--color-btn-bg);
      border-bottom: 2px solid var(--color-btn-bg);
    }
  }
}
</style>
