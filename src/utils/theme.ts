import { ITheme, isTheme } from "@/types/ITheme";

const localTheme = localStorage.getItem("theme");

const appTheme: ITheme = isTheme(localTheme) ? localTheme : "appDark";

export default appTheme;
