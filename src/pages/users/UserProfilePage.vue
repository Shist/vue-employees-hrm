<template>
  <div class="user-profile">
    <AvatarUpload />
    <UserInfo />
  </div>
</template>

<script setup lang="ts">
import AvatarUpload from "@/components/users/user-profile/AvatarUpload.vue";
import UserInfo from "@/components/users/user-profile/UserInfo.vue";
</script>

<style lang="scss" scoped>
.user-profile {
  margin: 0 auto;
  padding: 64px 24px;
  max-width: 850px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
