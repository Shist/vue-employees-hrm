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
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ROUTES } from "@/constants/router";
import { TAB_NAMES } from "@/constants/tabs";

const userTabs = ref(ROUTES.USER_PROFILE.NAME);

const cvsTabs = ref(ROUTES.CV_DETAILS.NAME);

const router = useRouter();

const route = useRoute();

watch(route, updateTabs);

updateTabs();

function updateTabs() {
  const [section, id, tab] = route.fullPath.slice(1).split("/");

  if (section === ROUTES.USERS.PATH.slice(1)) {
    switch (tab) {
      case undefined:
        userTabs.value = ROUTES.USER_PROFILE.NAME;
        break;
      case ROUTES.USER_SKILLS.PATH:
        userTabs.value = ROUTES.USER_SKILLS.NAME;
        break;
      case ROUTES.USER_LANGUAGES.PATH:
        userTabs.value = ROUTES.USER_LANGUAGES.NAME;
        break;
      case ROUTES.USER_CVS.PATH:
        userTabs.value = ROUTES.USER_CVS.NAME;
        break;
    }
  } else if (section === ROUTES.CVS.PATH.slice(1)) {
    switch (tab) {
      case undefined:
        cvsTabs.value = ROUTES.CV_DETAILS.NAME;
        break;
      case ROUTES.CV_SKILLS.PATH:
        cvsTabs.value = ROUTES.CV_SKILLS.NAME;
        break;
      case ROUTES.CV_PROJECTS.PATH:
        cvsTabs.value = ROUTES.CV_PROJECTS.NAME;
        break;
      case ROUTES.CV_PREVIEW.PATH:
        cvsTabs.value = ROUTES.CV_PREVIEW.NAME;
        break;
    }
  }
}

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
