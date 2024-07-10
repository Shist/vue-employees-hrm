import { appTheme, getThemeValue } from "@/utils/theme";
import "vue3-toastify/dist/index.css";

export default {
  clearOnUrlChange: false,
  theme: getThemeValue(appTheme),
};
