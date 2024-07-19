import VueCookies from "vue-cookies";

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
    $cookies.set(
      tokenType,
      tokenValue,
      tokenType === "accessToken" ? "10min" : "7d"
    );
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
