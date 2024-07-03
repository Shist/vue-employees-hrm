<template>
  <div class="user-profile">
    <AvatarUpload :userAvatar="user?.profile.avatar" />
    <UserInfo
      :userFirstName="user?.profile.first_name"
      :userLastName="user?.profile.last_name"
      :userEmail="user?.email"
      :isVerified="user?.is_verified"
      :userCreationDate="user?.created_at"
      :departmentID="user?.department?.id"
      :positionID="user?.position?.id"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AvatarUpload from "@/components/user/profile/AvatarUpload.vue";
import UserInfo from "@/components/user/profile/UserInfo.vue";
import { useRoute } from "vue-router";
import { useUsersStore } from "@/store/users";
import { IUser } from "@/types/backend-interfaces/user";

const route = useRoute();

// eslint-disable-next-line
const [section, id, tab] = route.fullPath.slice(1).split("/");

const { getUserById } = useUsersStore();

const user = ref<IUser | undefined>();

getUserById(Number(id))
  .then((userData) => {
    user.value = userData;
  })
  .catch(() => {
    // todo: show some error while loading user data
  });
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
