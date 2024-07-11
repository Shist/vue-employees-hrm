<template>
  <div class="user-profile">
    <v-progress-circular
      v-if="isLoading"
      :size="100"
      :width="10"
      color="var(--color-spinner)"
      indeterminate
    />
    <div v-else-if="isError" class="user-profile__error-wrapper">
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
    <div v-else-if="user" class="user-profile__main-content-wrapper">
      <AvatarUpload
        :isOwner="isOwner"
        :userID="id"
        :avatar="user.avatar"
        :userInitials="userInitials"
        @onUpdateUserAvatar="submitUserAvatar"
        @onDeleteUserAvatar="submitUserAvatarDeletion"
      />
      <UserInfo
        :isOwner="isOwner"
        :userID="id"
        :firstName="user.firstName"
        :lastName="user.lastName"
        :email="user.email"
        :isVerified="user.isVerified"
        :createdAt="user.createdAt"
        :departmentID="user.departmentID"
        :positionID="user.positionID"
        :departmentNames="departmentNames"
        :positionNames="positionNames"
        @onUpdateUserData="submitUserData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import AvatarUpload from "@/components/user/profile/AvatarUpload.vue";
import UserInfo from "@/components/user/profile/UserInfo.vue";
import { useRoute } from "vue-router";
import { getAllDepartmentNames } from "@/services/departments";
import { getAllPositionNames } from "@/services/positions";
import {
  IUserProfileData,
  IUserProfileServerData,
  IDepartmentNamesData,
  IPositionNamesData,
} from "@/types/userProfileUI";
import { IUpdateUserInput } from "@/types/backend-interfaces/user";
import { IUpdateProfileInput } from "@/types/backend-interfaces/user/profile";
import { IUploadAvatarInput } from "@/types/backend-interfaces/user/avatar";
import { ROUTES } from "@/constants/router";
import useToast from "@/composables/useToast";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { TOO_LARGE_FILE, INVALID_FILE_TYPE } from "@/constants/errorMessage";
import {
  deleteUserAvatar,
  getUserProfileByID,
  updateUserAvatar,
  updateUserData,
} from "@/services/users/profile";
import useErrorState from "@/composables/useErrorState";

const route = useRoute();

const id = computed<string>(() => {
  // eslint-disable-next-line
  const [section, id, tab] = route.fullPath.slice(1).split("/");
  return id;
});

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === id.value);

const {
  isLoading,
  isError,
  errorMessage,
  isNotFoundError,
  setErrorValuesToDefault,
  setErrorValues,
} = useErrorState();

const user = ref<IUserProfileData | null>(null);
const departmentNames = ref<IDepartmentNamesData[] | null>(null);
const positionNames = ref<IPositionNamesData[] | null>(null);

const { setErrorToast } = useToast();

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

onMounted(() => {
  fetchData();
});

watch(id, () => {
  fetchData();
});

function updateUserValue(newUser: IUserProfileServerData) {
  user.value = {
    email: newUser.email,
    createdAt: Number(newUser.created_at),
    isVerified: newUser.is_verified,
    firstName: newUser.profile.first_name,
    lastName: newUser.profile.last_name,
    avatar: newUser.profile.avatar,
    departmentID: newUser.department ? newUser.department.id : null,
    positionID: newUser.position ? newUser.position.id : null,
  };

  if (!authStoreUser.value || authStoreUser.value.id !== id.value) return;

  authStoreUser.value.firstName = newUser.profile.first_name;
  authStoreUser.value.lastName = newUser.profile.last_name;

  if (newUser.profile.first_name && newUser.profile.last_name) {
    authStoreUser.value.fullName = `${newUser.profile.first_name} ${newUser.profile.last_name}`;
  } else if (newUser.profile.first_name) {
    authStoreUser.value.fullName = newUser.profile.first_name;
  } else if (newUser.profile.last_name) {
    authStoreUser.value.fullName = newUser.profile.last_name;
  } else {
    authStoreUser.value.fullName = "";
  }
}

function fetchData() {
  isLoading.value = true;

  Promise.all([
    getUserProfileByID(id.value),
    getAllDepartmentNames(),
    getAllPositionNames(),
  ])
    .then(([userData, departmentNamesData, positionNamesData]) => {
      if (!userData || !departmentNamesData || !positionNamesData) return;
      updateUserValue(userData);
      departmentNames.value = departmentNamesData;
      positionNames.value = positionNamesData;

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function submitUserData(
  userInputObj: Omit<IUpdateUserInput, "cvsIds" | "role">,
  profileInputObj: IUpdateProfileInput
) {
  if (!isOwner.value) return;

  isLoading.value = true;

  updateUserData(userInputObj, profileInputObj)
    .then((response) => {
      if (!response) return;
      updateUserValue(response);

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function submitUserAvatar(avatarInputObj: IUploadAvatarInput) {
  if (!isOwner.value) return;

  if (
    avatarInputObj.type !== "image/png" &&
    avatarInputObj.type !== "image/jpeg" &&
    avatarInputObj.type !== "image/gif"
  ) {
    setErrorToast(INVALID_FILE_TYPE);
    return;
  }

  if (avatarInputObj.size > 524288) {
    setErrorToast(TOO_LARGE_FILE);
    return;
  }

  isLoading.value = true;

  updateUserAvatar(avatarInputObj)
    .then((newAvatarSRC) => {
      if (!newAvatarSRC) return;
      if (user.value) {
        user.value.avatar = newAvatarSRC;
      }

      if (authStoreUser.value && authStoreUser.value.id === id.value) {
        authStoreUser.value.avatar = newAvatarSRC;
      }

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function submitUserAvatarDeletion(userID: string) {
  if (!isOwner.value) return;

  isLoading.value = true;

  deleteUserAvatar(userID)
    .then(() => {
      if (user.value) {
        user.value.avatar = null;
      }

      if (authStoreUser.value && authStoreUser.value.id === id.value) {
        authStoreUser.value.avatar = null;
      }

      setErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setErrorValues(error);
    })
    .finally(() => {
      isLoading.value = false;
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
