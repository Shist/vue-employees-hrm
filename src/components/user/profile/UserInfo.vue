<template>
  <div class="user-info">
    <div class="user-info__info-captions-wrapper">
      <h3 v-if="computedFullName" class="user-info__name-caption">
        {{ computedFullName }}
      </h3>
      <div class="user-info__mail-caption-wrapper">
        <span class="user-info__mail-caption">{{ userData?.email }}</span>
        <v-icon
          v-if="userData?.isVerified"
          class="user-info__mail-verified-icon"
        >
          mdi-check-decagram
        </v-icon>
      </div>
      <span class="user-info__date-caption">
        {{ computedCreationDate }}
      </span>
    </div>
    <form class="user-info__info-inputs-form">
      <v-text-field
        v-model="firstName"
        :label="$t('label.firstName')"
        variant="outlined"
        class="user-info__text-field-wrapper"
        :readonly="!isOwner"
        hide-details
      />
      <v-text-field
        v-model="lastName"
        :label="$t('label.lastName')"
        variant="outlined"
        class="user-info__text-field-wrapper"
        :readonly="!isOwner"
        hide-details
      />
      <v-select
        v-model="departmentId"
        :items="departmentsItems"
        :label="$t('label.department')"
        variant="outlined"
        class="user-info__text-field-wrapper"
        :loading="areDepartmentsLoading"
        :readonly="!isOwner || areDepartmentsLoading || isDepartmentsError"
        hide-details
      />
      <v-select
        v-model="positionId"
        :items="positionsItems"
        :label="$t('label.position')"
        variant="outlined"
        class="user-info__text-field-wrapper"
        :loading="arePositionsLoading"
        :readonly="!isOwner || arePositionsLoading || isPositionsError"
        hide-details
      />
      <v-btn
        v-if="isOwner"
        type="submit"
        class="user-info__form-submit-btn"
        @click.prevent="onUpdateBtnClicked"
        :disabled="isSubmitBtnDisabled"
      >
        {{ $t("userProfilePage.btnUpdate") }}
      </v-btn>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import {
  IUserProfileData,
  IDepartmentNamesData,
  IPositionNamesData,
  IUpdateUserInput,
  IUpdateProfileInput,
  ISelectFieldData,
} from "@/types/pages/users/profile";

const { t, locale } = useI18n({ useScope: "global" });

const props = defineProps<{
  isOwner: boolean;
  userId: string;
  userData: IUserProfileData | null;
  departmentNames: IDepartmentNamesData[] | null;
  areDepartmentsLoading: boolean;
  isDepartmentsError: boolean;
  positionNames: IPositionNamesData[] | null;
  arePositionsLoading: boolean;
  isPositionsError: boolean;
}>();

const emit = defineEmits<{
  (
    event: "onUpdateUserData",
    userInputObj: Omit<IUpdateUserInput, "cvsIds" | "role">,
    profileInputObj: IUpdateProfileInput
  ): void;
}>();

const computedFullName = computed(() => {
  if (!props.userData?.firstName && !props.userData?.lastName) {
    return "";
  } else {
    if (props.userData.firstName && props.userData.lastName) {
      return `${props.userData.firstName} ${props.userData.lastName}`;
    } else if (props.userData.firstName) {
      return props.userData.firstName;
    } else {
      return props.userData.lastName;
    }
  }
});

const computedCreationDate = computed(() => {
  if (!props.userData) return "";

  const targetDate = new Date(props.userData.createdAt)
    .toLocaleDateString(locale.value === "ru" ? "ru-RU" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .replace(/,/g, "");
  return t("userProfilePage.userDateCaption", { targetDate: targetDate });
});

const firstName = ref(props.userData?.firstName);

const lastName = ref(props.userData?.lastName);

const prepareSelectItems = (
  objects: IDepartmentNamesData[] | IPositionNamesData[] | null,
  defaultItemText: string
) => {
  return [
    { title: defaultItemText, value: null },
    ...(objects?.map((obj) => ({ title: obj.name, value: obj.id })) || []),
  ];
};

const departmentId = ref(props.userData?.departmentId);
let departmentsItems: ISelectFieldData[] = [];
watchEffect(() => {
  if (departmentsItems.length > 1) return;
  departmentsItems = [
    {
      title: props.userData ? `${props.userData.departmentName}` : "",
      value: props.userData ? props.userData.departmentId : null,
    },
  ];
});
watchEffect(() => {
  const fetchedDepartments = prepareSelectItems(
    props.departmentNames,
    t("userProfilePage.noDepartment")
  );
  if (fetchedDepartments.length > 1) {
    departmentsItems = fetchedDepartments;
  }
});

const positionId = ref(props.userData?.positionId);
let positionsItems: ISelectFieldData[] = [];
watchEffect(() => {
  if (positionsItems.length > 1) return;
  positionsItems = [
    {
      title: props.userData ? `${props.userData.positionName}` : "",
      value: props.userData ? props.userData.positionId : null,
    },
  ];
});
watchEffect(() => {
  const fetchedPositions = prepareSelectItems(
    props.positionNames,
    t("userProfilePage.noPosition")
  );
  if (fetchedPositions.length > 1) {
    positionsItems = fetchedPositions;
  }
});

watchEffect(() => {
  firstName.value = props.userData?.firstName;
  lastName.value = props.userData?.lastName;
  departmentId.value = props.userData?.departmentId;
  positionId.value = props.userData?.positionId;
});

const isSubmitBtnDisabled = computed(
  () =>
    firstName.value === props.userData?.firstName &&
    lastName.value === props.userData?.lastName &&
    departmentId.value === props.userData?.departmentId &&
    positionId.value === props.userData?.positionId
);

function onUpdateBtnClicked() {
  const userInputObj: Omit<IUpdateUserInput, "cvsIds" | "role"> = {
    userId: Number(props.userId),
    departmentId: Number(departmentId.value),
    positionId: Number(positionId.value),
  };
  const profileInputObj: IUpdateProfileInput = {
    userId: Number(props.userId),
    first_name: firstName.value !== undefined ? firstName.value : null,
    last_name: lastName.value !== undefined ? lastName.value : null,
  };

  emit("onUpdateUserData", userInputObj, profileInputObj);
}
</script>

<style lang="scss" scoped>
.user-info {
  padding-block: 12px;
  display: flex;
  flex-direction: column;
  row-gap: 60px;
  @media (max-width: $tablet-s) {
    padding-block: 0 12px;
    row-gap: 30px;
  }
  &__info-captions-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 2px;
    @media (max-width: $tablet-s) {
      align-items: center;
    }
    .user-info__name-caption {
      @include default-text(26px, 32px);
      color: var(--color-text);
      @media (max-width: $phone-l) {
        font-size: 24px;
        line-height: 30px;
      }
      @media (max-width: $phone-m) {
        font-size: 22px;
        line-height: 28px;
      }
    }
    .user-info__mail-caption-wrapper {
      display: flex;
      align-items: center;
      column-gap: 5px;
      .user-info__mail-caption {
        @include default-text(18px, 24px);
        color: var(--color-text);
        @media (max-width: $phone-l) {
          font-size: 16px;
          line-height: 22px;
        }
        @media (max-width: $phone-m) {
          font-size: 14px;
          line-height: 20px;
        }
      }
      .user-info__mail-verified-icon {
        width: 24px;
        height: 24px;
        font-size: 24px;
      }
    }
    .user-info__date-caption {
      @include default-text(18px, 24px);
      color: var(--color-text);
      @media (max-width: $phone-l) {
        font-size: 16px;
        line-height: 22px;
      }
      @media (max-width: $phone-m) {
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
  &__info-inputs-form {
    display: grid;
    gap: 52px 32px;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      ".    ."
      ".    ."
      ".    btn";
    @media (max-width: $tablet-l) {
      grid-template-columns: 1fr;
      grid-template-areas:
        "."
        "."
        "."
        "."
        "btn";
    }
    .user-info__form-submit-btn {
      grid-area: btn;
      color: var(--color-btn-text);
      background-color: var(--color-btn-bg);
      border-radius: 0;
      &:hover {
        background-color: var(--color-btn-bg-hover);
      }
      &:disabled {
        filter: grayscale(50%);
      }
    }
  }
}

:deep(.user-info__text-field-wrapper .v-field__outline__start) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.user-info__text-field-wrapper .v-field__outline__end) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__start) {
  border-block: 1px solid var(--color-input-borders);
  border-left: 1px solid var(--color-input-borders);
}
:deep(.v-field--focused .v-field__outline__end) {
  border-block: 1px solid var(--color-input-borders);
  border-right: 1px solid var(--color-input-borders);
}
:deep(.user-info__text-field-wrapper .v-field__outline__notch::before) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::before) {
  border-top: 1px solid var(--color-input-borders);
}
:deep(.user-info__text-field-wrapper .v-field__outline__notch::after) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::after) {
  border-bottom: 1px solid var(--color-input-borders);
}
:deep(.user-info__text-field-wrapper .v-field-label) {
  transition: background-color 0.3s;
}
:deep(.v-field--focused .v-field-label) {
  color: var(--color-active-text);
}
</style>
