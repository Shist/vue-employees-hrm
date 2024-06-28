<template>
  <div class="user-info">
    <div class="user-info__info-captions-wrapper">
      <h3 class="user-info__name-caption">Pavel Zhukouski</h3>
      <div class="user-info__mail-caption-wrapper">
        <span class="user-info__mail-caption">pavel.zhouski041@gmail.com</span>
        <v-icon class="user-info__mail-verified-icon">
          mdi-check-decagram
        </v-icon>
      </div>
      <span class="user-info__date-caption">
        A member since Tue April 2 2024
      </span>
    </div>
    <form class="user-info__info-inputs-form">
      <v-text-field
        v-model="firstName"
        label="First Name"
        variant="outlined"
        class="user-info__text-field-wrapper"
      ></v-text-field>
      <v-text-field
        v-model="lastName"
        label="Last Name"
        variant="outlined"
        class="user-info__text-field-wrapper"
      ></v-text-field>
      <v-select
        v-model="department"
        label="Department"
        variant="outlined"
        class="user-info__text-field-wrapper"
      ></v-select>
      <v-select
        v-model="position"
        label="Position"
        variant="outlined"
        class="user-info__text-field-wrapper"
      ></v-select>
      <v-btn
        type="submit"
        class="user-info__form-submit-btn"
        :disabled="!firstName && !lastName && !department && !position"
      >
        Update
      </v-btn>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const firstName = ref(null);
const lastName = ref(null);
const department = ref(null);
const position = ref(null);
</script>

<style lang="scss" scoped>
.user-info {
  padding-block: 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 60px;
  &__info-captions-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 2px;
    .user-info__name-caption {
      @include default-text(26px, 32px);
    }
    .user-info__mail-caption-wrapper {
      display: flex;
      align-items: center;
      column-gap: 5px;
      .user-info__mail-caption {
        @include default-text(18px, 24px);
      }
      .user-info__mail-verified-icon {
        width: 24px;
        height: 24px;
        font-size: 24px;
      }
    }
    .user-info__date-caption {
      @include default-text(18px, 24px);
    }
  }
  &__info-inputs-form {
    display: grid;
    gap: 32px;
    grid-template-areas:
      ".    ."
      ".    ."
      ".    btn";
    @media (max-width: 768px) {
      grid-template-areas:
        "."
        "."
        "."
        "."
        "btn";
    }
    .user-info__text-field-wrapper {
    }
    .user-info__form-submit-btn {
      grid-area: btn;
    }
  }
}
</style>
