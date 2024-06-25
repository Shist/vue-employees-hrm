<template>
  <v-breadcrumbs :items="items" divider="$next">
    <template v-slot:prepend>
      <v-icon>mdi-home-outline</v-icon>
    </template>
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useThemeStore } from "@/store/useThemeStore";

const theme = useThemeStore();

const items = reactive([
  {
    title: "Home",
    disabled: false,
    href: "breadcrumbs_home",
  },
  {
    title: "Employees",
    disabled: true,
    href: "breadcrumbs_employees",
  },
]);
</script>

<style lang="scss" scopped></style>
