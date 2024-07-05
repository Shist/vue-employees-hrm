<template>
  <div class="avatar-upload">
    <div class="avatar-upload__avatar-wrapper">
      <v-skeleton-loader
        v-if="avatar === 'pending'"
        type="avatar"
        color="var(--color-header-bg)"
        class="avatar-upload__avatar-skeleton"
      />
      <EmptyAvatar v-if="avatar === null" :letter="`L`" />
      <v-img
        v-else-if="avatar !== 'pending' && avatar !== 'error'"
        :src="avatar"
        alt="avatar"
        class="avatar-upload__avatar"
      />
      <v-btn
        v-if="avatar !== null && avatar !== 'pending' && avatar !== 'error'"
        icon="mdi-close"
        class="avatar-upload__avatar-cross-btn"
        @click.prevent="avatarRemove"
        :disabled="!avatar"
      ></v-btn>
    </div>
    <label
      for="input-avatar"
      class="avatar-upload__upload-avatar-wrapper"
      @dragover.stop.prevent="avatarDragOver"
      @dragleave.stop.prevent="avatarDragLeave"
      @drop.stop.prevent="avatarDrop"
    >
      <input
        v-show="false"
        type="file"
        accept="image/png, image/jpg, image/jpeg, image/gif"
        id="input-avatar"
        @change.prevent="avatarChange"
        :disabled="!avatar"
      />
      <div class="avatar-upload__upload-avatar-headline-wrapper">
        <v-icon class="avatar-upload__upload-avatar-headline-icon">
          mdi-tray-arrow-up
        </v-icon>
        <h3 class="avatar-upload__upload-avatar-headline">
          Upload avatar image
        </h3>
      </div>
      <h4 class="avatar-upload__upload-avatar-formats-label">
        png, jpg or gif no more than 0.5MB
      </h4>
    </label>
  </div>
</template>

<script setup lang="ts">
import EmptyAvatar from "@/components/user/profile/avatar/EmptyAvatar.vue";

defineProps<{
  avatar: string | null;
}>();

function avatarRemove() {
  console.log("User clicked cross button, he wants to remove old avatar");
  // Remove old avatar from server
}

function avatarChange() {
  console.log("User clicked to input-label and choosed new avatar from window");
  // Load new avatar to server (choosed from window)
}

function avatarDragOver(e: Event) {
  if (!e.target || !(e.target instanceof HTMLElement)) return;
  const labelWrapper = e.target.closest(
    ".avatar-upload__upload-avatar-wrapper"
  );
  labelWrapper?.classList.add("green-filter-bg");
}

function avatarDragLeave(e: Event) {
  if (!e.target || !(e.target instanceof HTMLElement)) return;
  const labelWrapper = e.target.closest(
    ".avatar-upload__upload-avatar-wrapper"
  );
  labelWrapper?.classList.remove("green-filter-bg");
}

function avatarDrop(e: Event) {
  avatarDragLeave(e);

  console.log("User dropped new avatar to the input-label");
  // Load new avatar to server (drag-and-dropped to the field)
}
</script>

<style lang="scss" scoped>
.avatar-upload {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
  &__avatar-wrapper {
    position: relative;
    height: 120px;
    width: 120px;
    .avatar-upload__avatar {
      border-radius: 50%;
    }
    .avatar-upload__avatar-skeleton {
      padding: 10px;
      height: 120px;
      width: 120px;
    }
    .avatar-upload__avatar-cross-btn {
      position: absolute;
      width: 40px;
      height: 40px;
      top: -20px;
      right: -20px;
      background-color: var(--color-wrapper-bg);
      box-shadow: none;
    }
  }
  &__upload-avatar-wrapper {
    flex-grow: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    .avatar-upload__upload-avatar-headline-wrapper {
      padding-inline: 8px;
      display: flex;
      align-items: center;
      column-gap: 16px;
      .avatar-upload__upload-avatar-headline-icon {
        width: 35px;
        height: 35px;
        font-size: 35px;
      }
      .avatar-upload__upload-avatar-headline {
        @include default-headline(24px, 30px);
        color: var(--color-text);
      }
    }
    .avatar-upload__upload-avatar-formats-label {
      @include default-headline(16px, 20px);
      color: var(--color-gray-label-text);
    }
  }
}

:deep(.avatar-upload__avatar-skeleton .v-skeleton-loader__avatar) {
  margin: 0;
  max-width: 100px;
  width: 100%;
  max-height: 100px;
  height: 100%;
}
</style>
