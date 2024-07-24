import VueCookies from "vue-cookies";
import { ITokenData } from "@/types/authData";

export default function useCookies() {
  // eslint-disable-next-line
  const $cookies = (globalThis as any).$cookies as typeof VueCookies.VueCookies;

  function getToken(tokenType: "accessToken" | "refreshToken") {
    return $cookies.get(tokenType);
  }

  function setToken(
    tokenType: "accessToken" | "refreshToken",
    tokenValue: string
  ) {
    const tokenData: ITokenData = JSON.parse(atob(tokenValue.split(".")[1]));

    const expirationDate = new Date(tokenData.exp * 1000 - 5000);

    $cookies.set(tokenType, `Bearer ${tokenValue}`, expirationDate);
  }

  function removeToken(tokenType: "accessToken" | "refreshToken") {
    $cookies.remove(tokenType);
  }

  return {
    getToken,
    setToken,
    removeToken,
  };
}
