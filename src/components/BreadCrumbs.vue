<template>
  <v-breadcrumbs :items="breadcrumbsItems" divider="$next">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :title="item.title"
        :disabled="item.disabled"
        :to="item.to"
        :class="{'red-breadcrumb': (item as IBreadCrumbsItem).crumbNum === 3}"
      >
        <v-icon
          v-if="(item as IBreadCrumbsItem).crumbIconName"
          class="breadcrumbs-user-icon"
        >
          {{ `mdi-${(item as IBreadCrumbsItem).crumbIconName}` }}
        </v-icon>
        <span>{{ item.title }}</span>
      </v-breadcrumbs-item>
    </template>
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useBreadCrumbsStore } from "@/store/breadCrumbs";
import IBreadCrumbsItem from "@/types/IBreadCrumbsItem";
import { BREAD_CRUMBS_NAMES } from "@/constants/breadCrumbsNames";

type IBreadCrumbName = keyof typeof BREAD_CRUMBS_NAMES;

const { breadcrumbsItems } = useBreadCrumbsStore();

const route = useRoute();

watch(route, updateBreadCrumbs);

function updateBreadCrumbs() {
  if (route.name === "main" /*|| route.name === "user-profile"*/) {
    breadcrumbsItems.splice(1);
    breadcrumbsItems.push({
      crumbNum: 2,
      title: "Employees",
      disabled: true,
      to: {
        path: "/users",
      },
    });
  } else if (typeof route.name === "string") {
    // Think over
    // const [sectionName, sectionTab] = route.name.split("-");
    // breadcrumbsItems.splice(1);
    // breadcrumbsItems.push({
    //   crumbNum: 2,
    //   title: BREAD_CRUMBS_NAMES[sectionName as IBreadCrumbName],
    //   disabled: false,
    //   to: {
    //     path: `/${sectionName}s`,
    //   },
    // });
    // if (route.params.id) {
    //   breadcrumbsItems.push({
    //     crumbNum: 3,
    //     title: BREAD_CRUMBS_NAMES[sectionName as IBreadCrumbName],
    //     disabled: true,
    //     to: {
    //       path: `/${sectionName}s/${route.params.id}/${sectionTab}`,
    //     },
    //   });
    // }
  }
}
</script>

<style lang="scss" scopped>
.v-breadcrumbs-item > .v-breadcrumbs-item--link > .breadcrumbs-user-icon {
  margin-right: 10px;
  min-width: 24px;
  min-height: 24px;
  &::before {
    min-width: 24px;
    min-height: 24px;
    font-size: 24px;
  }
}
.red-breadcrumb > .v-breadcrumbs-item--link {
  color: var(--color-active-text);
}
</style>
