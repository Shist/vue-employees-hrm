import { Component } from "vue";
import AppSpinner from "@/components/UI/AppSpinner.vue";
import AppErrorSection from "@/components/UI/AppErrorSection.vue";

export default {
  AppSpinner: AppSpinner,
  AppErrorSection: AppErrorSection,
} as {
  [key: string]: Component;
};
