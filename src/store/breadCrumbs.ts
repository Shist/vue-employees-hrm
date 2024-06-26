import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import IBreadCrumbsItem from "@/types/IBreadCrumbsItem";

export const useBreadCrumbsStore = defineStore("breadCrumbs", () => {
  const breadcrumbsItems: Reactive<IBreadCrumbsItem[]> = reactive([
    {
      crumbNum: 1,
      title: "Home",
      disabled: false,
      to: {
        path: "/users",
      },
      crumbIconName: "home-outline",
    },
    {
      crumbNum: 2,
      title: "Employees",
      disabled: true,
      to: {
        path: "/users",
      },
    },
  ]);

  return { breadcrumbsItems };
});
