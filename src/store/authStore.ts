import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import useToast from "@/composables/useToast";
import { login, register } from "@/services/auth";
import { getUserAuthDataById } from "@/services/users/users";
import { handleLogout } from "@/utils/handleErrors";
import { ROUTES } from "@/constants/router";
import { UNAUTHORIZED_ERROR } from "@/constants/errorMessage";
import {
  IAuthData,
  IAuthServerData,
  IUserAuthData,
  ITokenData,
} from "@/types/authData";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref<IUserAuthData | null>(null);

  const accessToken = ref<string | null>(localStorage.getItem("accessToken"));
  const decodedAccessToken = computed<ITokenData | null>(() => {
    const decodedData = atob(
      accessToken.value ? accessToken.value.split(".")[1] : ""
    );
    return decodedData ? JSON.parse(decodedData) : null;
  });

  const wasAuthErrorToastShown = ref(false);

  const router = useRouter();

  const { setErrorToast } = useToast();

  const fetchUserAuthData = async () => {
    if (!accessToken.value) return;

    try {
      const userData = await getUserAuthDataById(
        `${decodedAccessToken.value?.sub}`
      );

      if (!userData) return;

      user.value = {
        id: userData.id,
        email: userData.email,
        firstName: userData.profile.first_name,
        lastName: userData.profile.last_name,
        fullName: userData.profile.full_name,
        avatar: userData.profile.avatar,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.cause === UNAUTHORIZED_ERROR) {
          handleLogout();
          return;
        }

        setErrorToast(error.message);
      }
    }
  };

  const setAuthValues = (authServerData: IAuthServerData) => {
    if (!authServerData) return;

    const authData: IAuthData = {
      user: {
        id: authServerData.user.id,
        email: authServerData.user.email,
        firstName: authServerData.user.profile.first_name,
        lastName: authServerData.user.profile.last_name,
        fullName: authServerData.user.profile.full_name,
        avatar: authServerData.user.profile.avatar,
      },
      accessToken: authServerData.access_token,
      refreshToken: authServerData.refresh_token,
    };

    user.value = authData.user;
    accessToken.value = authData.accessToken;

    localStorage.setItem("accessToken", `Bearer ${accessToken.value}`);

    // TODO: set refreshToken to cookies

    wasAuthErrorToastShown.value = false;
  };

  const loginUser = async (email: string, password: string) => {
    const authServerData = await login(email, password);

    setAuthValues(authServerData);
  };

  const registerUser = async (email: string, password: string) => {
    const authServerData = await register(email, password);

    setAuthValues(authServerData);
  };

  const logout = () => {
    user.value = null;
    accessToken.value = null;
    localStorage.removeItem("accessToken");
    router.push(ROUTES.SIGN_IN.PATH);
  };

  return {
    user,
    fetchUserAuthData,
    loginUser,
    logout,
    registerUser,
    wasAuthErrorToastShown,
  };
});
