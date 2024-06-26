<template>
  <div class="app-header">
    <div class="app-header__buttons">
      <v-btn
        variant="text"
        class="app-header__btn"
        :class="[isActive === 'login' ? 'app-header__btn-active' : '']"
        @click="handleIsActive"
      >
        LOGIN
      </v-btn>
      <v-btn
        variant="text"
        class="app-header__btn"
        :class="[isActive === 'signup' ? 'app-header__btn-active' : '']"
        @click="handleIsActive"
      >
        SIGNUP
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const isActive = computed(() => {
  return route.fullPath === "/sign-in" ? "login" : "signup";
});

const handleIsActive = () => {
  if (isActive.value === "login") {
    router.push({ name: "register" });
  } else {
    router.push({ name: "login" });
  }
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
    color: var(--color-header-text);
  }
  &__buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    min-height: 48px;
    margin-top: auto;
    .app-header__btn {
      @include default-text(14px, 1.25);
      letter-spacing: normal;
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
