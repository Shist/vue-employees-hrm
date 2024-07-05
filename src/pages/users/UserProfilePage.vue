<template>
  <div class="user-profile">
    <div v-if="isError" class="user-profile__error-wrapper">
      <h4 class="user-profile__error-message">❌ {{ errorMessage }}</h4>
      <v-btn
        v-if="isNotFoundError"
        class="user-profile__back-to-main-btn"
        router
        :to="ROUTES.USERS.PATH"
      >
        Back to the main page
      </v-btn>
      <span v-if="!isNotFoundError" class="user-profile__try-to-reload-label">
        Please try to reload the page
      </span>
    </div>
    <v-progress-circular
      v-else-if="!user"
      :size="100"
      :width="10"
      color="var(--color-spinner)"
      indeterminate
    />
    <div v-else class="user-profile__main-content-wrapper">
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
import { UNEXPECTED_ERROR } from "@/constants/errorMessage";
import { ROUTES } from "@/constants/router";

const route = useRoute();

// eslint-disable-next-line
const [section, id, tab] = route.fullPath.slice(1).split("/");

const user = ref<IUsersProfileData | null>(null);

const isError = ref(false);
const errorMessage = ref(UNEXPECTED_ERROR);
const isNotFoundError = ref(false);

onMounted(() => {
  getUserProfileByID(id)
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
    })
    .catch((error: unknown) => {
      isError.value = true;

      if (error instanceof Error) {
        errorMessage.value = error.message;

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
  &__error-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    .user-profile__error-message {
      @include default-text(26px, 32px);
    }
    .user-profile__back-to-main-btn {
      color: var(--color-btn-text);
      background-color: var(--color-btn-bg);
      border-radius: 0;
      &:hover {
        background-color: var(--color-btn-bg-hover);
      }
    }
    .user-profile__try-to-reload-label {
      @include default-text(20px, 26px);
    }
  }
  &__spinner-wrapper {
    width: 100%;
  }
  &__main-content-wrapper {
    width: 100%;
  }
}
</style>
