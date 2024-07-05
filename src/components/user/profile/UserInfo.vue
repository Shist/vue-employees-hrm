<template>
  <div class="user-info">
    <div class="user-info__info-captions-wrapper">
      <h3 class="user-info__name-caption">
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
        hide-details
      />
      <v-text-field
        v-model="lastName"
        label="Last Name"
        variant="outlined"
        class="user-info__text-field-wrapper"
        hide-details
      />
      <v-select
        v-model="departmentID"
        :items="departmentsItems"
        label="Department"
        variant="outlined"
        class="user-info__text-field-wrapper"
        hide-details
      />
      <v-select
        v-model="positionID"
        :items="positionsItems"
        label="Position"
        variant="outlined"
        class="user-info__text-field-wrapper"
        hide-details
      />
      <v-btn
        type="submit"
        class="user-info__form-submit-btn"
        @click.prevent="submitChanges"
        :disabled="isSubmitBtnDisabled"
      >
        UPDATE
      </v-btn>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useDepartmentsStore } from "@/store/departments";
import { usePositionsStore } from "@/store/positions";

const props = defineProps<{
  email: string;
  createdAt: number;
  isVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  departmentID: number;
  positionID: number;
}>();

const computedFullName = computed(() => {
  if (!props.firstName && !props.lastName) {
    return "(Neither first nor last name are specified)";
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

const departmentID = ref(props.departmentID);
const { departments } = useDepartmentsStore();
const departmentsItems = computed(() => [
  { title: "No department", value: null },
  ...departments.map((dep) => ({ title: dep.name, value: dep.id })),
]);

const positionID = ref(props.positionID);
const { positions } = usePositionsStore();
const positionsItems = computed(() => [
  { title: "No position", value: null },
  ...positions.map((pos) => ({ title: pos.name, value: pos.id })),
]);

watchEffect(() => {
  firstName.value = props.firstName;
  lastName.value = props.lastName;
  departmentID.value = props.departmentID;
  positionID.value = props.positionID;
});

const isSubmitBtnDisabled = computed(
  () =>
    !departmentID.value ||
    !positionID.value ||
    (firstName.value === props.firstName &&
      lastName.value === props.lastName &&
      departmentID.value === props.departmentID &&
      positionID.value === props.positionID)
);

function submitChanges() {
  // TODO - send new user data to server
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
