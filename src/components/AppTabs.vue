<template>
  <v-tabs v-if="$route.meta.hasTabs === TAB_NAMES.USER" v-model="userTabs">
    <v-tab
      :value="ROUTES.USER_PROFILE.NAME"
      @click="() => openUserInfoRoute(ROUTES.USER_PROFILE.PATH)"
    >
      Profile
    </v-tab>
    <v-tab
      :value="ROUTES.USER_SKILLS.NAME"
      @click="() => openUserInfoRoute(ROUTES.USER_SKILLS.PATH)"
    >
      Skills
    </v-tab>
    <v-tab
      :value="ROUTES.USER_LANGUAGES.NAME"
      @click="() => openUserInfoRoute(ROUTES.USER_LANGUAGES.PATH)"
    >
      Languages
    </v-tab>
    <v-tab
      :value="ROUTES.USER_CVS.NAME"
      @click="() => openUserInfoRoute(ROUTES.USER_CVS.PATH)"
    >
      CVs
    </v-tab>
  </v-tabs>
  <v-tabs v-if="$route.meta.hasTabs === TAB_NAMES.CV" v-model="cvsTabs">
    <v-tab
      :value="ROUTES.CV_DETAILS.NAME"
      @click="() => openCVInfoRoute(ROUTES.CV_DETAILS.PATH)"
    >
      Details
    </v-tab>
    <v-tab
      :value="ROUTES.CV_SKILLS.NAME"
      @click="() => openCVInfoRoute(ROUTES.CV_SKILLS.PATH)"
    >
      Skills
    </v-tab>
    <v-tab
      :value="ROUTES.CV_PROJECTS.NAME"
      @click="() => openCVInfoRoute(ROUTES.CV_PROJECTS.PATH)"
    >
      Projects
    </v-tab>
    <v-tab
      :value="ROUTES.CV_PREVIEW.NAME"
      @click="() => openCVInfoRoute(ROUTES.CV_PREVIEW.PATH)"
    >
      Preview
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "@/constants/router";
import { TAB_NAMES } from "@/constants/tabs";

const userTabs = ref(ROUTES.USER_PROFILE.NAME);

const cvsTabs = ref(ROUTES.CV_DETAILS.NAME);

const router = useRouter();

function openUserInfoRoute(routePath: string) {
  if (routePath) routePath = `/${routePath}`;
  const currentUserId = router.currentRoute.value.params.userId;
  router.replace(`${ROUTES.USERS.PATH}/${currentUserId}${routePath}`);
}

function openCVInfoRoute(routePath: string) {
  if (routePath) routePath = `/${routePath}`;
  const currentCVId = router.currentRoute.value.params.cvId;
  router.replace(`${ROUTES.CVS.PATH}/${currentCVId}${routePath}`);
}
</script>

<style lang="scss" scopped></style>
