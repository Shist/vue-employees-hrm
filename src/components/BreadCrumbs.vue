<template>
  <v-breadcrumbs :items="breadcrumbsItems" divider="$next">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :title="item.title"
        :disabled="item.disabled"
        :to="item.to"
        @click="() => updateBreadCrumbs((item as IBreadCrumbsItem).crumbNum)"
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
