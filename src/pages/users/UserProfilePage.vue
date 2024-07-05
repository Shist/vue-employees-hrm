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
      <AvatarUpload :avatar="user.avatar" :userInitials="userInitials" />
      <UserInfo
        :firstName="user.firstName"
        :lastName="user.lastName"
        :email="user.email"
        :isVerified="user.isVerified"
        :createdAt="user.createdAt"
        :departmentID="user.departmentID"
        :positionID="user.positionID"
        :departmentNames="departmentNames"
        :positionNames="positionNames"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import AvatarUpload from "@/components/user/profile/AvatarUpload.vue";
import UserInfo from "@/components/user/profile/UserInfo.vue";
import { useRoute } from "vue-router";
import { getUserProfileByID } from "@/services/users";
import { getAllDepartmentNames } from "@/services/departments";
import { getAllPositionNames } from "@/services/positions";
import {
  IUsersProfileData,
  IDepartmentNamesData,
  IPositionNamesData,
} from "@/types/userProfileUI";
import { UNEXPECTED_ERROR } from "@/constants/errorMessage";
import { ROUTES } from "@/constants/router";
import useToast from "@/composables/useToast";

const route = useRoute();

const id = computed<string>(() => {
  // eslint-disable-next-line
  const [section, id, tab] = route.fullPath.slice(1).split("/");
  return id;
});

const user = ref<IUsersProfileData | null>(null);
const departmentNames = ref<IDepartmentNamesData[] | null>(null);
const positionNames = ref<IPositionNamesData[] | null>(null);

const isError = ref(false);
const errorMessage = ref(UNEXPECTED_ERROR);
const isNotFoundError = ref(false);

const userInitials = computed(() => {
  if (user.value?.firstName) {
    return user.value.firstName.charAt(0).toUpperCase();
  } else if (user.value?.lastName) {
    return user.value.lastName.charAt(0).toUpperCase();
  } else if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase();
  } else {
    return "";
  }
});

const { setErrorToast } = useToast();

onMounted(() => {
  fetchData();
});

watch(id, () => {
  fetchData();
});

function fetchData() {
  Promise.all([
    getUserProfileByID(id.value),
    getAllDepartmentNames(),
    getAllPositionNames(),
  ])
    .then(([userData, departmentNamesData, positionNamesData]) => {
      user.value = {
        email: userData.email,
        createdAt: Number(userData.created_at),
        isVerified: userData.is_verified,
        firstName: userData.profile.first_name,
        lastName: userData.profile.last_name,
        avatar: userData.profile.avatar,
        departmentID: userData.department ? userData.department.id : null,
        positionID: userData.position ? userData.position.id : null,
      };
      departmentNames.value = departmentNamesData;
      positionNames.value = positionNamesData;

      isError.value = false;
      errorMessage.value = UNEXPECTED_ERROR;
      isNotFoundError.value = false;
    })
    .catch((error: unknown) => {
      isError.value = true;

      if (error instanceof Error) {
        errorMessage.value = error.message;

        if (error.name === "NotFoundError") {
          isNotFoundError.value = true;
        }

        setErrorToast(errorMessage.value);
      }
    });
}
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
