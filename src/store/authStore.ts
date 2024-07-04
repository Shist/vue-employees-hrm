import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { login, register } from "@/services/auth";
import { ROUTES } from "@/constants/router";
import { useRouter } from "vue-router";
import { IUserAuthData } from "@/types/userAuthUI";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref<IUserAuthData | null>(
    JSON.parse(`${localStorage.getItem("user")}`)
  );
  const token = ref<string | null>(localStorage.getItem("token"));
  const refreshTokenTimer = ref<undefined | number>(undefined);

  const isLoggedIn = computed(() => {
    return !!token.value && !!user.value;
  });

  const router = useRouter();

  const loginUser = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result) {
      user.value = result.user;
      token.value = result.token;
    }

    localStorage.setItem("token", `Bearer ${token.value}`);
    localStorage.setItem("user", JSON.stringify(user.value));

    checkTokenExpiration();
  };

  const registerUser = async (email: string, password: string) => {
    const result = await register(email, password);
    if (result) {
      user.value = result.user;
      token.value = result.token;
    }

    localStorage.setItem("token", `Bearer ${token.value}`);
    localStorage.setItem("user", JSON.stringify(user.value));

    checkTokenExpiration();
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearTimeout(refreshTokenTimer.value);
    router.push(ROUTES.SIGN_IN.PATH);
  };

  const checkAuthorization = () => {
    try {
      if (token.value && user.value) {
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
      const decodedToken = JSON.parse(atob(token.value.split(".")[1]));
      const expirationTime = decodedToken.exp * 1000;
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
    loginUser,
    logout,
    checkAuthorization,
    checkTokenExpiration,
    isLoggedIn,
    registerUser,
  };
});
