<template>
  <v-tabs v-if="$route.meta.hasTabs === 'userTabs'" v-model="userTabs">
    <v-tab value="profile" @click="() => openUserInfoRoute('')">
      Profile
    </v-tab>
    <v-tab value="skills" @click="() => openUserInfoRoute('/skills')">
      Skills
    </v-tab>
    <v-tab value="languages" @click="() => openUserInfoRoute('/languages')">
      Languages
    </v-tab>
    <v-tab value="cvs" @click="() => openUserInfoRoute('/cvs')">CVs</v-tab>
  </v-tabs>
  <v-tabs v-if="$route.meta.hasTabs === 'cvsTabs'" v-model="cvsTabs">
    <v-tab value="details">Details</v-tab>
    <v-tab value="skills">Skills</v-tab>
    <v-tab value="projects">Projects</v-tab>
    <v-tab value="preview">Preview</v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const userTabs = ref("profile");
const cvsTabs = ref("details");

const router = useRouter();

function openUserInfoRoute(routeName: string) {
  const currentUserId = router.currentRoute.value.params.id;
  router.replace(`/users/${currentUserId}${routeName}`);
}
</script>

<style lang="scss" scopped></style>
