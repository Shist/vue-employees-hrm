<template>
  <v-breadcrumbs :items="breadcrumbsItems" divider="$next">
    <template v-slot:prepend>
      <v-icon>mdi-home-outline</v-icon>
    </template>
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :title="item.title"
        :disabled="item.disabled"
        :to="item.to"
        @click="() => updateBreadCrumbs((item as IBreadCrumbsItem).crumbNum)"
      />
    </template>
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { useBreadCrumbsStore } from "@/store/breadCrumbs";
import IBreadCrumbsItem from "@/types/IBreadCrumbsItem";

const { breadcrumbsItems } = useBreadCrumbsStore();

function updateBreadCrumbs(crumbNum: number) {
  if (crumbNum === 1) {
    breadcrumbsItems.splice(1);
    breadcrumbsItems.push({
      crumbNum: 2,
      title: "Employees",
      disabled: true,
      to: {
        path: "/users",
      },
    });
  } else {
    breadcrumbsItems.splice(crumbNum);
    breadcrumbsItems[breadcrumbsItems.length - 1].disabled = true;
  }
}
</script>

<style lang="scss" scopped></style>
