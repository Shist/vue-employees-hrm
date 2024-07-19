<template>
  <div class="user-profile">
    <AppSpinner v-if="isLoading" />
    <AppErrorSection v-else-if="isError" :errorMessage="errorMessage" />
    <div v-else-if="user" class="user-profile__main-content-wrapper">
      <AvatarUpload
        :isOwner="isOwner"
        :userId="userId"
        :avatar="user.avatar"
        :userInitials="userInitials"
        @onUpdateUserAvatar="submitUserAvatar"
        @onDeleteUserAvatar="submitUserAvatarDeletion"
      />
      <UserInfo
        :isOwner="isOwner"
        :userId="userId"
        :firstName="user.firstName"
        :lastName="user.lastName"
        :email="user.email"
        :isVerified="user.isVerified"
        :createdAt="user.createdAt"
        :departmentId="user.departmentId"
        :positionId="user.positionId"
        :departmentNames="departmentNames"
        :positionNames="positionNames"
        @onUpdateUserData="submitUserData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useBreadCrumbsStore } from "@/store/breadCrumbs";
import AvatarUpload from "@/components/user/profile/AvatarUpload.vue";
import UserInfo from "@/components/user/profile/UserInfo.vue";
import useToast from "@/composables/useToast";
import useErrorState from "@/composables/useErrorState";
import { getAllDepartmentNames } from "@/services/departments";
import { getAllPositionNames } from "@/services/positions";
import {
  deleteUserAvatar,
  getUserProfileById,
  updateUserAvatar,
  updateUserData,
} from "@/services/users/profile";
import { TOO_LARGE_FILE, INVALID_FILE_TYPE } from "@/constants/errorMessage";
import {
  IUserProfileData,
  IUserProfileServerData,
  IDepartmentNamesData,
  IPositionNamesData,
  IUploadAvatarInput,
  IUpdateUserInput,
  IUpdateProfileInput,
} from "@/types/pages/users/profile";

const route = useRoute();

const userId = computed<string>(() => {
  // eslint-disable-next-line
  const [section, userId, tab] = route.fullPath.slice(1).split("/");
  return userId;
});

const authStore = useAuthStore();
const authStoreUser = storeToRefs(authStore).user;
const isOwner = computed(() => authStoreUser.value?.id === userId.value);

const { newEnityName } = storeToRefs(useBreadCrumbsStore());

const {
  isLoading,
  isError,
  errorMessage,
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

watch(userId, () => {
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
    departmentId: newUser.department ? newUser.department.id : null,
    positionId: newUser.position ? newUser.position.id : null,
  };

  if (!authStoreUser.value || authStoreUser.value.id !== userId.value) return;

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

async function fetchData() {
  isLoading.value = true;

  try {
    const userData = await getUserProfileById(userId.value);
    const departmentNamesData = await getAllDepartmentNames();
    const positionNamesData = await getAllPositionNames();

    if (!userData || !departmentNamesData || !positionNamesData) return;

    updateUserValue(userData);
    departmentNames.value = departmentNamesData;
    positionNames.value = positionNamesData;

    setErrorValuesToDefault();
  } catch (error: unknown) {
    setErrorValues(error);
  } finally {
    isLoading.value = false;
  }
}

function submitUserData(
  userInputObj: Omit<IUpdateUserInput, "cvsIds" | "role">,
  profileInputObj: IUpdateProfileInput
) {
  if (!isOwner.value) return;

  isLoading.value = true;

  updateUserData(userInputObj, profileInputObj)
    .then((freshUserData) => {
      if (!freshUserData) return;

      updateUserValue(freshUserData);

      const firstName = freshUserData.profile.first_name;
      const lastName = freshUserData.profile.last_name;
      const email = freshUserData.email;

      if (firstName && lastName) {
        newEnityName.value = `${firstName} ${lastName}`;
      } else if (firstName) {
        newEnityName.value = firstName;
      } else if (lastName) {
        newEnityName.value = lastName;
      } else {
        newEnityName.value = email;
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

      if (authStoreUser.value && authStoreUser.value.id === userId.value) {
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

function submitUserAvatarDeletion(_userId: string) {
  if (!isOwner.value) return;

  isLoading.value = true;

  deleteUserAvatar(_userId)
    .then(() => {
      if (user.value) {
        user.value.avatar = null;
      }

      if (authStoreUser.value && authStoreUser.value.id === userId.value) {
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
  &__spinner-wrapper {
    width: 100%;
  }
  &__main-content-wrapper {
    width: 100%;
  }
}
</style>
