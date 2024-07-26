<template>
  <v-tabs
    v-if="$route.meta.hasTabs === TAB_NAMES.USER"
    v-model="userTabs"
    color="var(--color-active-text)"
    show-arrows
  >
    <v-tab
      :value="ROUTES.USER_PROFILE.NAME"
      @click="() => openUserInfoRoute(ROUTES.USER_PROFILE.PATH)"
      class="app-tab"
    >
      {{ $t("appTabs.profile") }}
    </v-tab>
    <v-tab
      :value="ROUTES.USER_SKILLS.NAME"
      @click="() => openUserInfoRoute(ROUTES.USER_SKILLS.PATH)"
      class="app-tab"
    >
      {{ $t("appTabs.skills") }}
    </v-tab>
    <v-tab
      :value="ROUTES.USER_LANGUAGES.NAME"
      @click="() => openUserInfoRoute(ROUTES.USER_LANGUAGES.PATH)"
      class="app-tab"
    >
      {{ $t("appTabs.languages") }}
    </v-tab>
    <v-tab
      :value="ROUTES.USER_CVS.NAME"
      @click="() => openUserInfoRoute(ROUTES.USER_CVS.PATH)"
      class="app-tab"
    >
      {{ $t("appTabs.cvs") }}
    </v-tab>
  </v-tabs>
  <v-tabs
    v-if="$route.meta.hasTabs === TAB_NAMES.CV"
    v-model="cvsTabs"
    color="var(--color-active-text)"
    show-arrows
  >
    <v-tab
      :value="ROUTES.CV_DETAILS.NAME"
      @click="() => openCvInfoRoute(ROUTES.CV_DETAILS.PATH)"
      class="app-tab"
    >
      {{ $t("appTabs.details") }}
    </v-tab>
    <v-tab
      :value="ROUTES.CV_SKILLS.NAME"
      @click="() => openCvInfoRoute(ROUTES.CV_SKILLS.PATH)"
      class="app-tab"
    >
      {{ $t("appTabs.skills") }}
    </v-tab>
    <v-tab
      :value="ROUTES.CV_PROJECTS.NAME"
      @click="() => openCvInfoRoute(ROUTES.CV_PROJECTS.PATH)"
      class="app-tab"
    >
      {{ $t("appTabs.projects") }}
    </v-tab>
    <v-tab
      :value="ROUTES.CV_PREVIEW.NAME"
      @click="() => openCvInfoRoute(ROUTES.CV_PREVIEW.PATH)"
      class="app-tab"
    >
      {{ $t("appTabs.preview") }}
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
  // eslint-disable-next-line
  const [section, id, tab] = route.fullPath.slice(1).split("/");

  if (section === ROUTES.USERS.PATH.slice(1)) {
    switch (tab) {
      case ROUTES.USER_PROFILE.PATH:
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
      case ROUTES.CV_DETAILS.PATH:
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
  router.push(`${ROUTES.USERS.PATH}/${currentUserId}${routePath}`);
}

function openCvInfoRoute(routePath: string) {
  if (routePath) routePath = `/${routePath}`;
  const currentCvId = router.currentRoute.value.params.cvId;
  router.push(`${ROUTES.CVS.PATH}/${currentCvId}${routePath}`);
}
</script>

<style lang="scss" scopped>
.v-btn.app-tab {
  width: 150px;
  @media (max-width: $phone-l) {
    width: 120px;
  }
}
</style>
