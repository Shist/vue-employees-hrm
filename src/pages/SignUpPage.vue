<template>
  <div class="sign-up">
    <auth-form
      title="Register Now"
      subtitleText="Welcome! Sign up to continue."
      buttonText="SIGN UP"
      linkText="I HAVE AN ACCOUNT"
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
