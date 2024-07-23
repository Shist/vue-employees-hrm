import { ObjectDirective } from "vue";
import VLongPress from "@/directives/VLongPress";

export default {
  "long-press": VLongPress,
} as {
  [key: string]: ObjectDirective;
};
