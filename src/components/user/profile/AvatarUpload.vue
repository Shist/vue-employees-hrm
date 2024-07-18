<template>
  <div class="avatar-upload" :class="{ 'avatar-upload_avatar-only': !isOwner }">
    <div class="avatar-upload__avatar-wrapper">
      <v-avatar
        color="var(--color-avatar-bg)"
        size="default"
        class="avatar-upload__avatar-img-wrapper"
      >
        <v-img v-if="avatar" alt="User avatar" :src="avatar || undefined" />
        <p v-else class="avatar-upload__initials-label">
          {{ userInitials }}
        </p>
      </v-avatar>
      <v-btn
        v-if="avatar && isOwner"
        icon="mdi-close"
        class="avatar-upload__avatar-cross-btn"
        @click.prevent="avatarRemove"
      ></v-btn>
    </div>
    <label
      v-if="isOwner"
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
import { IUploadAvatarInput } from "@/types/backend-interfaces/user/avatar";
import fileToBase64 from "@/utils/fileToBase64";

const props = defineProps<{
  isOwner: boolean;
  userId: string;
  avatar: string | null;
  userInitials: string;
}>();

const emit = defineEmits<{
  (event: "onUpdateUserAvatar", avatarInputObj: IUploadAvatarInput): void;
  (event: "onDeleteUserAvatar", userId: string): void;
}>();

function avatarRemove() {
  emit("onDeleteUserAvatar", props.userId);
}

async function uploadAvatar(file: File) {
  const fileBase64 = await fileToBase64(file);
  emit("onUpdateUserAvatar", {
    userId: Number(props.userId),
    base64: fileBase64,
    size: file.size,
    type: file.type,
  });
}

function avatarChange(e: Event) {
  if (
    !e.target ||
    !(e.target instanceof HTMLInputElement) ||
    !e.target.files ||
    !e.target.files.length
  ) {
    return;
  }

  const file = e.target.files[0];
  uploadAvatar(file);
}

function avatarDragOver(e: DragEvent) {
  if (!e.target || !(e.target instanceof HTMLElement)) return;
  const labelWrapper = e.target.closest(
    ".avatar-upload__upload-avatar-wrapper"
  );
  labelWrapper?.classList.add("dark-red-filter-bg");
}

function avatarDragLeave(e: DragEvent) {
  if (!e.target || !(e.target instanceof HTMLElement)) return;
  const labelWrapper = e.target.closest(
    ".avatar-upload__upload-avatar-wrapper"
  );
  labelWrapper?.classList.remove("dark-red-filter-bg");
}

function avatarDrop(e: DragEvent) {
  avatarDragLeave(e);

  if (
    !e.dataTransfer ||
    !e.dataTransfer.files ||
    !e.dataTransfer.files.length
  ) {
    return;
  }

  const file = e.dataTransfer.files[0];
  uploadAvatar(file);
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
  &_avatar-only {
    justify-content: flex-start;
  }
  &__avatar-wrapper {
    position: relative;
    height: 120px;
    width: 120px;
    .avatar-upload__avatar-img-wrapper {
      height: 120px;
      width: 120px;
    }
    .avatar-upload__initials-label {
      font-family: $font-roboto;
      font-size: 40px;
      line-height: 44px;
      color: var(--color-avatar-initials);
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
