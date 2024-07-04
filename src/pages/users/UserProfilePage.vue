<template>
  <div class="user-profile">
    <AvatarUpload :avatar="user.avatar" />
    <UserInfo
      :firstName="user.firstName"
      :lastName="user.lastName"
      :email="user.email"
      :isVerified="user.isVerified"
      :createdAt="user.createdAt"
      :departmentID="user.departmentID"
      :positionID="user.positionID"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import AvatarUpload from "@/components/user/profile/AvatarUpload.vue";
import UserInfo from "@/components/user/profile/UserInfo.vue";
import { useRoute } from "vue-router";
import { getUserProfileByID } from "@/services/users";
import { IUsersProfileData } from "@/types/userProfileUI";

const route = useRoute();

// eslint-disable-next-line
const [section, id, tab] = route.fullPath.slice(1).split("/");

const user = reactive<IUsersProfileData>({
  email: "pending",
  createdAt: "pending",
  isVerified: "pending",
  firstName: "pending",
  lastName: "pending",
  avatar: "pending",
  departmentID: "pending",
  positionID: "pending",
});

onMounted(() => {
  getUserProfileByID(Number(id)).then((userData) => {
    if (userData !== "error") {
      user.email = userData.email;
      user.createdAt = Number(userData.created_at);
      user.isVerified = userData.is_verified;
      user.firstName = userData.profile.first_name;
      user.lastName = userData.profile.last_name;
      user.avatar = userData.profile.avatar;
      user.departmentID = Number(userData.department.id);
      user.positionID = Number(userData.position.id);
    } else {
      user.email = "error";
      user.createdAt = "error";
      user.isVerified = "error";
      user.firstName = "error";
      user.lastName = "error";
      user.avatar = "error";
      user.departmentID = "error";
      user.positionID = "error";
    }
  });
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
