<template>
  <div class="user-profile">
    <div v-if="isError" class="some-error">
      <span class="some-error__message">{{ errorMessage }}</span>
      <a v-if="isNotFoundError" href="#" class="some-error__link-to-main">
        Link to main
      </a>
    </div>
    <div v-else-if="!user" class="some-spinner">Loading</div>
    <div v-else>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AvatarUpload from "@/components/user/profile/avatar/AvatarUpload.vue";
import UserInfo from "@/components/user/profile/UserInfo.vue";
import { useRoute } from "vue-router";
import { getUserProfileByID } from "@/services/users";
import { IUsersProfileData } from "@/types/userProfileUI";
import useToast from "@/composables/useToast";

const route = useRoute();

// eslint-disable-next-line
const [section, id, tab] = route.fullPath.slice(1).split("/");

const user = ref<IUsersProfileData | null>(null);

const isError = ref(false);
const errorMessage = ref("Unknown error");
const isNotFoundError = ref(false);

const { setLoadingToast, removeCurrToast, setErrorToast } = useToast();

onMounted(() => {
  setLoadingToast("Loading user profile data...");

  getUserProfileByID(Number(id))
    .then((userData) => {
      user.value = {
        email: userData.email,
        createdAt: Number(userData.created_at),
        isVerified: userData.is_verified,
        firstName: userData.profile.first_name,
        lastName: userData.profile.last_name,
        avatar: userData.profile.avatar,
        departmentID: Number(userData.department.id),
        positionID: Number(userData.position.id),
      };

      removeCurrToast();
    })
    .catch((error: unknown) => {
      isError.value = true;

      if (error instanceof Error) {
        errorMessage.value = error.message;

        setErrorToast(errorMessage.value);

        if (error.name === "NotFoundError") {
          isNotFoundError.value = true;
        }
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
