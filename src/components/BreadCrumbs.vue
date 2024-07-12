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
import { reactive, Reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useBreadCrumbsStore } from "@/store/breadCrumbs";
import { getUserNameDataByID } from "@/services/users/users";
import { getCVNameDataByID } from "@/services/cvs";
import { ROUTES } from "@/constants/router";
import {
  SECTIONS_NAMES,
  SECTIONS_ICONS,
  TABS_NAMES,
} from "@/constants/breadCrumbs";
import { IBreadCrumbsItem } from "@/types/navigation";

const breadcrumbsItems: Reactive<IBreadCrumbsItem[]> = reactive([]);

const { user } = storeToRefs(useAuthStore());

const route = useRoute();

watch(route, updateBreadCrumbs);

const { newEnityName } = storeToRefs(useBreadCrumbsStore());

watch(newEnityName, updateEntityName);

updateBreadCrumbs();

function updateBreadCrumbs() {
  const [section, id, tab] = route.fullPath.slice(1).split("/");

  breadcrumbsItems.splice(0, breadcrumbsItems.length);

  breadcrumbsItems.push({
    crumbNum: 1,
    title: SECTIONS_NAMES.HOME,
    disabled: false,
    to: {
      path: ROUTES.USERS.PATH,
    },
    crumbIconName: SECTIONS_ICONS.HOME,
  });

  if (section) {
    breadcrumbsItems.push({
      crumbNum: 2,
      title: SECTIONS_NAMES[section],
      disabled: id === undefined,
      to: {
        path: `/${section}`,
      },
    });
  }

  if (id) {
    breadcrumbsItems.push({
      crumbNum: 3,
      title: "Loading...",
      disabled: tab === undefined,
      to: {
        path: `/${section}/${id}`,
      },
      crumbIconName: SECTIONS_ICONS[section],
    });

    switch (section) {
      case ROUTES.USERS.PATH.slice(1):
        if (id === user.value?.id) {
          const userFullName = user.value.fullName;
          breadcrumbsItems[2].title = userFullName
            ? userFullName
            : user.value.email;
        } else {
          getUserNameDataByID(id)
            .then((userData) => {
              if (!userData) throw new Error("Empty user data!");
              const userFullName = userData.profile.full_name;
              breadcrumbsItems[2].title = userFullName
                ? userFullName
                : userData.email;
            })
            .catch(() => {
              breadcrumbsItems[2].title = `❌ Loading Error`;
            });
        }
        break;
      case ROUTES.CVS.PATH.slice(1):
        getCVNameDataByID(id)
          .then((cvData) => {
            if (!cvData) throw new Error("Empty CV data!");
            breadcrumbsItems[2].title = cvData.name;
          })
          .catch(() => {
            breadcrumbsItems[2].title = `❌ Loading Error`;
          });
        break;
    }
  }

  if (tab) {
    breadcrumbsItems.push({
      crumbNum: 4,
      title: TABS_NAMES[tab],
      disabled: true,
      to: {
        path: `/${section}/${id}`,
      },
    });
  }
}

function updateEntityName() {
  if (!breadcrumbsItems[2] || !newEnityName.value) return;

  breadcrumbsItems[2].title = newEnityName.value;

  newEnityName.value = null;
}
</script>

<style lang="scss" scopped>
.v-breadcrumbs-item > .v-breadcrumbs-item--link > .breadcrumbs-user-icon {
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
  display: flex;
  align-items: center;
  column-gap: 8px;
  i {
    display: inline;
    text-decoration: none;
  }
  span {
    max-width: 370px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
  }
}
</style>
