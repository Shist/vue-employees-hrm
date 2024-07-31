<template>
  <div class="user-profile">
    <AppSpinner v-if="isUserLoading" />
    <AppErrorSection
      v-else-if="isUserError"
      :errorMessageKey="userErrorMessage"
    />
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
        :userData="user"
        :departmentNames="departmentNames"
        :areDepartmentsLoading="areDepartmentsLoading"
        :isDepartmentsError="isDepartmentsError"
        :positionNames="positionNames"
        :arePositionsLoading="arePositionsLoading"
        :isPositionsError="isPositionsError"
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
import { useI18n } from "vue-i18n";
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
import {
  IUserProfileData,
  IUserProfileServerData,
  IDepartmentNamesData,
  IPositionNamesData,
  IUploadAvatarInput,
  IUpdateUserInput,
  IUpdateProfileInput,
} from "@/types/pages/users/profile";

const { t } = useI18n({ useScope: "global" });

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
  isLoading: isUserLoading,
  isError: isUserError,
  errorMessageKey: userErrorMessage,
  setErrorValuesToDefault: setUserErrorValuesToDefault,
  setErrorValues: setUserErrorValues,
} = useErrorState();

const {
  isLoading: areDepartmentsLoading,
  isError: isDepartmentsError,
  setErrorValuesToDefault: setDepartmentsErrorValuesToDefault,
  setErrorValues: setDepartmentsErrorValues,
} = useErrorState();

const {
  isLoading: arePositionsLoading,
  isError: isPositionsError,
  setErrorValuesToDefault: setPositionsErrorValuesToDefault,
  setErrorValues: setPositionsErrorValues,
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
    departmentName: newUser.department ? newUser.department.name : null,
    positionId: newUser.position ? newUser.position.id : null,
    positionName: newUser.position ? newUser.position.name : null,
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

async function fetchUserData() {
  isUserLoading.value = true;
  try {
    const userData = await getUserProfileById(userId.value);

    if (!userData) return;

    updateUserValue(userData);

    setUserErrorValuesToDefault();
  } catch (error) {
    setUserErrorValues(error);
  } finally {
    isUserLoading.value = false;
  }
}

async function fetchDepartmentsNames() {
  areDepartmentsLoading.value = true;
  try {
    const departmentNamesData = await getAllDepartmentNames();

    if (!departmentNamesData) return;

    departmentNames.value = departmentNamesData;

    setDepartmentsErrorValuesToDefault();
  } catch (error) {
    setDepartmentsErrorValues(error);

    setErrorToast(t("errors.FAILED_TO_LOAD_DEPARMENTS"));
  } finally {
    areDepartmentsLoading.value = false;
  }
}

async function fetchPositionsNames() {
  arePositionsLoading.value = true;
  try {
    const positionNamesData = await getAllPositionNames();

    if (!positionNamesData) return;

    positionNames.value = positionNamesData;

    setPositionsErrorValuesToDefault();
  } catch (error) {
    setPositionsErrorValues(error);

    setErrorToast(t("errors.FAILED_TO_LOAD_POSITIONS"));
  } finally {
    arePositionsLoading.value = false;
  }
}

async function fetchData() {
  await fetchUserData();
  await fetchDepartmentsNames();
  await fetchPositionsNames();
}

function submitUserData(
  userInputObj: Omit<IUpdateUserInput, "cvsIds" | "role">,
  profileInputObj: IUpdateProfileInput
) {
  if (!isOwner.value) return;

  isUserLoading.value = true;

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

      setUserErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setUserErrorValues(error);
    })
    .finally(() => {
      isUserLoading.value = false;
    });
}

function submitUserAvatar(avatarInputObj: IUploadAvatarInput) {
  if (!isOwner.value) return;

  isUserLoading.value = true;

  updateUserAvatar(avatarInputObj)
    .then((newAvatarSRC) => {
      if (!newAvatarSRC) return;

      if (user.value) {
        user.value.avatar = newAvatarSRC;
      }

      if (authStoreUser.value && authStoreUser.value.id === userId.value) {
        authStoreUser.value.avatar = newAvatarSRC;
      }

      setUserErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setUserErrorValues(error);
    })
    .finally(() => {
      isUserLoading.value = false;
    });
}

function submitUserAvatarDeletion(_userId: string) {
  if (!isOwner.value) return;

  isUserLoading.value = true;

  deleteUserAvatar(_userId)
    .then(() => {
      if (user.value) {
        user.value.avatar = null;
      }

      if (authStoreUser.value && authStoreUser.value.id === userId.value) {
        authStoreUser.value.avatar = null;
      }

      setUserErrorValuesToDefault();
    })
    .catch((error: unknown) => {
      setUserErrorValues(error);
    })
    .finally(() => {
      isUserLoading.value = false;
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
  @media (max-width: $tablet-l) {
    padding: 32px 12px;
  }
  @media (max-width: $phone-l) {
    padding: 16px 10px;
  }
  &__spinner-wrapper {
    width: 100%;
  }
  &__main-content-wrapper {
    width: 100%;
  }
}
</style>
