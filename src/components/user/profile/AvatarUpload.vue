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
        @click.prevent="handleOpenDeleteModal"
      ></v-btn>
    </div>
    <label
      v-if="isOwner && !isAvatarFileReady"
      for="input-avatar"
      class="avatar-upload__prepare-avatar-wrapper"
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
      <div class="avatar-upload__prepare-avatar-headline-wrapper">
        <v-icon class="avatar-upload__prepare-avatar-headline-icon">
          mdi-tray-arrow-up
        </v-icon>
        <h3 class="avatar-upload__prepare-avatar-headline">
          {{ $t("userProfilePage.avatarHeadline") }}
        </h3>
      </div>
      <h4 class="avatar-upload__prepare-avatar-formats-label">
        {{ $t("userProfilePage.avatarFormats") }}
      </h4>
    </label>
    <div v-else-if="isOwner" class="avatar-upload__upload-avatar-wrapper">
      <h3 class="avatar-upload__upload-avatar-headline">
        {{ $t("userProfilePage.avatarUploadHeadline") }}
      </h3>
      <span class="avatar-upload__upload-avatar-formats-label">
        {{ $t("userProfilePage.fileName") }} {{ avatarFile?.name }}
      </span>
      <span class="avatar-upload__upload-avatar-formats-label">
        {{ $t("userProfilePage.fileSize") }} {{ avatarSizeLabel }}
      </span>
      <div class="avatar-upload__upload-btns-wrapper">
        <v-btn
          variant="outlined"
          @click="cancelAvatarUpload"
          class="avatar-upload__btn-cancel-upload"
        >
          {{ $t("button.cancelButton") }}
        </v-btn>
        <v-btn
          type="submit"
          variant="text"
          @click="confirmAvatarUpload"
          class="avatar-upload__btn-confirm-upload"
        >
          {{ $t("button.uploadButton") }}
        </v-btn>
      </div>
    </div>
  </div>
  <AvatarDeleteModal
    :isOpen="isDeleteModalOpen"
    @confirmDeleteUserAvatar="submitUserAvatarDeletion"
    @closeModal="handleCloseDeleteModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import AvatarDeleteModal from "@/components/user/profile/AvatarDeleteModal.vue";
import useToast from "@/composables/useToast";
import handleScrollPadding from "@/utils/handleScrollPadding";
import fileToBase64 from "@/utils/fileToBase64";
import { IUploadAvatarInput } from "@/types/pages/users/profile";

const { t } = useI18n({ useScope: "global" });

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

const avatarFile = ref<File | null>(null);
const isAvatarFileReady = ref(false);

const avatarSizeLabel = computed(() => {
  return avatarFile.value
    ? `${(avatarFile.value.size / 1024).toFixed(2)} KB`
    : "0 KB";
});

const isDeleteModalOpen = ref(false);

watch(isDeleteModalOpen, (newValue) => {
  handleScrollPadding(newValue);
});

const { setErrorToast } = useToast();

async function confirmAvatarUpload() {
  if (!avatarFile.value) return;

  const fileBase64 = await fileToBase64(avatarFile.value);

  emit("onUpdateUserAvatar", {
    userId: Number(props.userId),
    base64: fileBase64,
    size: avatarFile.value.size,
    type: avatarFile.value.type,
  });

  avatarFile.value = null;
  isAvatarFileReady.value = false;
}

function cancelAvatarUpload() {
  avatarFile.value = null;
  isAvatarFileReady.value = false;
}

function prepareAvatar(file: File) {
  if (
    file.type !== "image/png" &&
    file.type !== "image/jpeg" &&
    file.type !== "image/gif"
  ) {
    setErrorToast(t("errors.INVALID_FILE_TYPE"));
    return;
  }

  if (file.size > 524288) {
    setErrorToast(t("errors.TOO_LARGE_FILE"));
    return;
  }

  avatarFile.value = file;
  isAvatarFileReady.value = true;
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
  prepareAvatar(file);
}

function avatarDragOver(e: DragEvent) {
  if (!e.target || !(e.target instanceof HTMLElement)) return;
  const labelWrapper = e.target.closest(
    ".avatar-upload__prepare-avatar-wrapper"
  );
  labelWrapper?.classList.add("dark-red-filter-bg");
}

function avatarDragLeave(e: DragEvent) {
  if (!e.target || !(e.target instanceof HTMLElement)) return;
  const labelWrapper = e.target.closest(
    ".avatar-upload__prepare-avatar-wrapper"
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
  prepareAvatar(file);
}

function handleOpenDeleteModal() {
  if (!props.isOwner) return;

  isDeleteModalOpen.value = true;
}

function submitUserAvatarDeletion() {
  emit("onDeleteUserAvatar", props.userId);

  isDeleteModalOpen.value = false;
  handleScrollPadding(false);
}

function handleCloseDeleteModal() {
  isDeleteModalOpen.value = false;
}
</script>

<style lang="scss" scoped>
.avatar-upload {
  padding: 20px;
  min-height: 185px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  @media (max-width: $tablet-s) {
    flex-direction: column;
  }
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
  &__prepare-avatar-wrapper {
    flex-grow: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    .avatar-upload__prepare-avatar-headline-wrapper {
      padding-inline: 8px;
      display: flex;
      align-items: center;
      column-gap: 16px;
      .avatar-upload__prepare-avatar-headline-icon {
        width: 35px;
        height: 35px;
        font-size: 35px;
        @media (max-width: $phone-l) {
          width: 25px;
          height: 25px;
          font-size: 25px;
        }
      }
      .avatar-upload__prepare-avatar-headline {
        @include default-headline(24px, 30px);
        color: var(--color-text);
        text-align: center;
        @media (max-width: $phone-l) {
          font-size: 18px;
          line-height: 24px;
        }
        @media (max-width: $phone-m) {
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
    .avatar-upload__prepare-avatar-formats-label {
      @include default-headline(16px, 20px);
      color: var(--color-gray-label-text);
      text-align: center;
      @media (max-width: $phone-l) {
        font-size: 14px;
        line-height: 18px;
      }
      @media (max-width: $phone-m) {
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
  &__upload-avatar-wrapper {
    flex-grow: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 2px;
    .avatar-upload__upload-avatar-headline {
      @include default-headline(24px, 30px);
      color: var(--color-text);
      text-align: center;
      @media (max-width: $tablet-l) {
        font-size: 20px;
        line-height: 26px;
      }
    }
    .avatar-upload__upload-avatar-formats-label {
      @include default-headline(16px, 20px);
      color: var(--color-gray-label-text);
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-wrap: nowrap;
      @media (max-width: $tablet-l) {
        max-width: 200px;
        font-size: 12px;
        line-height: 16px;
      }
    }
    .avatar-upload__upload-btns-wrapper {
      margin-top: 10px;
      align-self: stretch;
      display: flex;
      justify-content: center;
      column-gap: 20px;
      .avatar-upload__btn-cancel-upload {
        padding: 6px;
        max-width: 150px;
        width: 100%;
        color: var(--color-btn-gray-text);
        background-color: var(--color-wrapper-bg);
        border-radius: 0;
        border: 1px solid rgba(var(--color-btn-gray-text-rgb), 0.5);
        &:hover {
          background-color: rgba(var(--color-btn-gray-text-rgb), 0.08);
          border: 1px solid var(--color-btn-gray-text);
        }
        @media (max-width: $phone-l) {
          max-width: 100px;
        }
      }
      .avatar-upload__btn-confirm-upload {
        padding: 6px;
        max-width: 150px;
        width: 100%;
        color: var(--color-btn-text);
        background-color: var(--color-btn-bg);
        border-radius: 0;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
          rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
          rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
        &:hover {
          background-color: var(--color-btn-bg-hover);
        }
        &:disabled {
          filter: grayscale(50%);
        }
        @media (max-width: $phone-l) {
          max-width: 100px;
        }
      }
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
:deep(.avatar-upload__btn-cancel-upload .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
:deep(.avatar-upload__btn-confirm-upload .v-btn__content) {
  @media (max-width: $phone-l) {
    font-size: 10px;
  }
}
</style>
