<template>
  <div class="user-cvs" v-if="!isLoading">
    <!-- <v-text-field
      v-model="search"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      single-line
      class="user-cvs__text-field-wrapper"
    />
    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      :class="{ 'main-page__data-table': true }"
      hide-details
    >
      <template v-slot:[`item.avatar`]="{ item }">
        <v-avatar color="var(--color-wrapper-bg)" size="default">
          <v-img
            :src="item.avatar ?? undefined"
            alt="Avatar"
            class="main-page__table-img-avatar"
          />
        </v-avatar>
      </template>
      <template v-slot:[`item.options`]="{ item }">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              v-bind="props"
              class="main-page__popup-menu-btn"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item @click="() => openUserProfile(item.id)">
              <v-list-item-title class="main-page__popup-menu-label">
                Profile
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="console.log('Update user')" disabled>
              <v-list-item-title class="main-page__popup-menu-label">
                Update user
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="console.log('Delete user')" disabled>
              <v-list-item-title class="main-page__popup-menu-label">
                Delete user
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isLoading = ref(false);
</script>

<style lang="scss" scoped>
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  padding: 12px 16px;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  padding: 12px 16px;
}
</style>
