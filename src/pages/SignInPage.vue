<template>
  <div class="sign-in">
    <auth-form
      title="Welcome Back"
      subtitleText="Hello again! Sign in to continue."
      buttonText="Signin"
      linkText="Go to Sign Up"
    />
  </div>
</template>

<script setup lang="ts">
import AuthForm from "../components/AuthForm.vue";
</script>

<style lang="scss" scoped>
.sign-in {
  padding-top: 50px;
  flex-grow: 1;
}
</style>
