<template>
  <div class="sign-in">
    <auth-form
      :title="$t('signIn.title')"
      :subtitleText="$t('signIn.subtitleText')"
      :buttonText="$t('signIn.buttonText')"
      :linkText="$t('signIn.linkText').toUpperCase()"
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
