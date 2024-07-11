import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { login, register } from "@/services/auth";
import { getUserAuthDataByID } from "@/services/users/users";
import { ROUTES } from "@/constants/router";
import { useRouter } from "vue-router";
import { IUserAuthData } from "@/types/userAuthUI";
import { ITokenData } from "@/types/tokenData";
import useToast from "@/composables/useToast";
import { handleLogout } from "@/utils/handleErrors";
import { UNAUTHORIZED_ERROR } from "@/constants/errorMessage";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref<IUserAuthData | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const decodedToken = computed<ITokenData | null>(() => {
    const decodedData = atob(token.value ? token.value.split(".")[1] : "");
    return decodedData ? JSON.parse(decodedData) : null;
  });

  const wasAuthErrorToastShown = ref(false);

  const router = useRouter();
  const { setErrorToast } = useToast();

  const fetchUserAuthData = async () => {
    if (!token.value) return;

    try {
      const userData = await getUserAuthDataByID(`${decodedToken.value?.sub}`);

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

  const loginUser = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result) {
      user.value = result.user;
      token.value = result.token;
    }

    localStorage.setItem("token", `Bearer ${token.value}`);

    wasAuthErrorToastShown.value = false;
  };

  const registerUser = async (email: string, password: string) => {
    const result = await register(email, password);
    if (result) {
      user.value = result.user;
      token.value = result.token;
    }

    localStorage.setItem("token", `Bearer ${token.value}`);

    wasAuthErrorToastShown.value = false;
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    router.push(ROUTES.SIGN_IN.PATH);
  };

  return {
    user,
    fetchUserAuthData,
    loginUser,
    logout,
    registerUser,
    token,
    decodedToken,
    wasAuthErrorToastShown,
  };
});
