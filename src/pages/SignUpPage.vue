<template>
  <div class="sign-up">
    <auth-form
      :title="$t('signUp.title')"
      :subtitleText="$t('signUp.subtitleText')"
      :buttonText="$t('signUp.buttonText')"
      :linkText="$t('signUp.linkText').toUpperCase()"
    />
  </div>
</template>

<script setup lang="ts">
import AuthForm from "@/components/AuthForm.vue";
</script>

<style lang="scss" scoped>
.sign-up {
  padding-top: 100px;
}
</style>
