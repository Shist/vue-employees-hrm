<template>
  <div class="user-info">
    <div class="user-info__info-captions-wrapper">
      <h3 v-if="computedFullName" class="user-info__name-caption">
        {{ computedFullName }}
      </h3>
      <div class="user-info__mail-caption-wrapper">
        <span class="user-info__mail-caption">{{ email }}</span>
        <v-icon v-if="isVerified" class="user-info__mail-verified-icon">
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
        label="First Name"
        variant="outlined"
        class="user-info__text-field-wrapper"
        :readonly="!isOwner"
        hide-details
      />
      <v-text-field
        v-model="lastName"
        label="Last Name"
        variant="outlined"
        class="user-info__text-field-wrapper"
        :readonly="!isOwner"
        hide-details
      />
      <v-select
        v-model="departmentId"
        :items="departmentsItems"
        label="Department"
        variant="outlined"
        class="user-info__text-field-wrapper"
        :readonly="!isOwner"
        hide-details
      />
      <v-select
        v-model="positionId"
        :items="positionsItems"
        label="Position"
        variant="outlined"
        class="user-info__text-field-wrapper"
        :readonly="!isOwner"
        hide-details
      />
      <v-btn
        v-if="isOwner"
        type="submit"
        class="user-info__form-submit-btn"
        @click.prevent="onUpdateBtnClicked"
        :disabled="isSubmitBtnDisabled"
      >
        UPDATE
      </v-btn>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import {
  IDepartmentNamesData,
  IPositionNamesData,
  IUpdateUserInput,
  IUpdateProfileInput,
} from "@/types/pages/users/profile";

const props = defineProps<{
  isOwner: boolean;
  userId: string;
  email: string;
  createdAt: number;
  isVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  departmentId: string | null;
  positionId: string | null;
  departmentNames: IDepartmentNamesData[] | null;
  positionNames: IPositionNamesData[] | null;
}>();

const emit = defineEmits<{
  (
    event: "onUpdateUserData",
    userInputObj: Omit<IUpdateUserInput, "cvsIds" | "role">,
    profileInputObj: IUpdateProfileInput
  ): void;
}>();

const computedFullName = computed(() => {
  if (!props.firstName && !props.lastName) {
    return "";
  } else {
    if (props.firstName && props.lastName) {
      return `${props.firstName} ${props.lastName}`;
    } else if (props.firstName) {
      return props.firstName;
    } else {
      return props.lastName;
    }
  }
});

const computedCreationDate = computed(() => {
  const targetDate = new Date(props.createdAt)
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .replace(/,/g, "");
  return `A member since ${targetDate}`;
});

const firstName = ref(props.firstName);

const lastName = ref(props.lastName);

const prepareSelectItems = (
  objects: IDepartmentNamesData[] | IPositionNamesData[] | null,
  defaultItemText: string
) => {
  return computed(() => [
    { title: defaultItemText, value: null },
    ...(objects?.map((obj) => ({ title: obj.name, value: obj.id })) || []),
  ]);
};

const departmentId = ref(props.departmentId);
const departmentsItems = prepareSelectItems(
  props.departmentNames,
  "No department"
);

const positionId = ref(props.positionId);
const positionsItems = prepareSelectItems(props.positionNames, "No position");

watchEffect(() => {
  firstName.value = props.firstName;
  lastName.value = props.lastName;
  departmentId.value = props.departmentId;
  positionId.value = props.positionId;
});

const isSubmitBtnDisabled = computed(
  () =>
    firstName.value === props.firstName &&
    lastName.value === props.lastName &&
    departmentId.value === props.departmentId &&
    positionId.value === props.positionId
);

function onUpdateBtnClicked() {
  const userInputObj: Omit<IUpdateUserInput, "cvsIds" | "role"> = {
    userId: Number(props.userId),
    departmentId: Number(departmentId.value),
    positionId: Number(positionId.value),
  };
  const profileInputObj: IUpdateProfileInput = {
    userId: Number(props.userId),
    first_name: firstName.value,
    last_name: lastName.value,
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
  &__info-captions-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 2px;
    .user-info__name-caption {
      @include default-text(26px, 32px);
      color: var(--color-text);
    }
    .user-info__mail-caption-wrapper {
      display: flex;
      align-items: center;
      column-gap: 5px;
      .user-info__mail-caption {
        @include default-text(18px, 24px);
        color: var(--color-text);
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
