<template>
  <div class="sign-in">
    <auth-form
      :title="$t('signIn.title')"
      subtitleText="Hello again! Sign in
    to continue."
      buttonText="SIGN IN"
      linkText="I DON'T HAVE AN ACCOUNT"
    />
  </div>
</template>

<script setup lang="ts">
import AuthForm from "@/components/AuthForm.vue";
</script>

<style lang="scss" scoped>
.sign-in {
  padding-top: 100px;
}
</style>
