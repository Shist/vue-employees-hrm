import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { login, register } from "@/services/auth";
import { getUserAuthDataByID } from "@/services/users";
import { ROUTES } from "@/constants/router";
import { useRouter } from "vue-router";
import { IUserAuthData } from "@/types/userAuthUI";
import { ITokenData } from "@/types/tokenData";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref<IUserAuthData | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const decodedToken = computed<ITokenData>(() =>
    JSON.parse(atob(token.value ? token.value.split(".")[1] : ""))
  );
  const refreshTokenTimer = ref<undefined | number>(undefined);

  const isLoggedIn = computed(() => {
    return !!token.value;
  });

  const router = useRouter();

  const fetchUserAuthData = async () => {
    const userData = await getUserAuthDataByID(`${decodedToken.value.sub}`);

    if (!userData) throw new Error("Empty user data!");

    user.value = {
      id: userData.id,
      email: userData.email,
      firstName: userData.profile.first_name,
      lastName: userData.profile.last_name,
      fullName: userData.profile.full_name,
      avatar: userData.profile.avatar,
    };
  };

  const loginUser = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result) {
      user.value = result.user;
      token.value = result.token;
    }

    localStorage.setItem("token", `Bearer ${token.value}`);

    checkTokenExpiration();
  };

  const registerUser = async (email: string, password: string) => {
    const result = await register(email, password);
    if (result) {
      user.value = result.user;
      token.value = result.token;
    }

    localStorage.setItem("token", `Bearer ${token.value}`);

    checkTokenExpiration();
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    clearTimeout(refreshTokenTimer.value);
    router.push(ROUTES.SIGN_IN.PATH);
  };

  const checkAuthorization = () => {
    try {
      if (token.value) {
        checkTokenExpiration();
      } else {
        router.push(ROUTES.SIGN_IN.PATH);
      }
    } catch (error) {
      router.push(ROUTES.SIGN_IN.PATH);
    }
  };

  const checkTokenExpiration = () => {
    if (token.value) {
      const expirationTime = decodedToken.value.exp * 1000;
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        logout();
        return;
      }
      const remainingTime = 5000;
      refreshTokenTimer.value = setTimeout(checkTokenExpiration, remainingTime);
    }
  };

  return {
    user,
    fetchUserAuthData,
    loginUser,
    logout,
    checkAuthorization,
    checkTokenExpiration,
    isLoggedIn,
    registerUser,
  };
});
