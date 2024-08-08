import { ref } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import useCookies from "@/composables/useCookies";
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
  const { t } = useI18n({
    useScope: "global",
  });
  const router = useRouter();

  const { getToken, setToken, removeToken } = useCookies();

  const { setErrorToast } = useToast();

  const user = ref<IUserAuthData | null>(null);

  const wasAuthErrorToastShown = ref(false);

  const fetchUserAuthData = async () => {
    const token = getToken("accessToken") ?? getToken("refreshToken");

    if (!token) {
      return;
    }

    try {
      const tokenData: ITokenData = JSON.parse(atob(token.split(".")[1]));

      const userData = await getUserAuthDataById(`${tokenData.sub}`);

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

        setErrorToast(t(`errors.${error.message}`));
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

    setToken("accessToken", authData.accessToken);
    setToken("refreshToken", authData.refreshToken);

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
    removeToken("accessToken");
    removeToken("refreshToken");
    localStorage.removeItem("wasAuthorized");
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
