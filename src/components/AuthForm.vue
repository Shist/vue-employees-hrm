<template>
  <div class="auth">
    <h1 class="auth__title">{{ props.title }}</h1>
    <p class="auth__subtitle">{{ props.subtitleText }}</p>
    <form @submit.prevent="submitForm" class="auth__form" novalidate>
      <v-text-field
        v-model="formData.email"
        class="auth__input"
        :label="$t('placeholder.email')"
        variant="outlined"
        :error-messages="formErrors.email"
      />
      <br />
      <v-text-field
        v-model="formData.password"
        class="auth__input"
        :label="$t('placeholder.password')"
        variant="outlined"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="handleShowPassword"
        :error-messages="formErrors.password"
      />
      <div class="auth__form-error">
        <p v-if="serverError" class="auth__form-error-text">
          {{ serverError }}
        </p>
      </div>
      <v-btn
        type="submit"
        class="auth__button"
        :disabled="isLoading || v$.$errors.length > 0"
      >
        {{ props.buttonText }}
      </v-btn>
    </form>
    <router-link :to="handleAuthLink" class="auth__link">{{
      props.linkText
    }}</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "vue-i18n";
import useVuelidate from "@vuelidate/core";
import { required, minLength, email, helpers } from "@vuelidate/validators";
import { handleValidationErrors } from "@/utils/handleValidationErrors";
import { ROUTES } from "@/constants/router";
import { IForm, IAuthForm } from "@/types/forms";

const { t } = useI18n({ useScope: "global" });

const authStore = useAuthStore();

const props = defineProps<IAuthForm>();

const route = useRoute();
const router = useRouter();

const formData = reactive<IForm>({
  email: "",
  password: "",
});
const isLoading = ref<boolean>(false);
const serverError = ref<string | null>(null);
const showPassword = ref<boolean>(false);

const handleAuthLink = computed<string>(() => {
  return route.fullPath === ROUTES.SIGN_IN.PATH
    ? ROUTES.SIGN_UP.PATH
    : ROUTES.SIGN_IN.PATH;
});

const rules = computed(() => {
  return route.fullPath === ROUTES.SIGN_UP.PATH
    ? {
        email: {
          required: helpers.withMessage(
            t("errors.EMAIL_REQUIRED_FIELD"),
            required
          ),
          email: helpers.withMessage(t("errors.EMAIL_TYPE_FIELD"), email),
        },
        password: {
          required: helpers.withMessage(
            t("errors.PASSWORD_REQUIRED_FIELD"),
            required
          ),
          minLength: helpers.withMessage(
            t("errors.PASSWORD_MINLENGTH_FIELD"),
            minLength(6)
          ),
        },
      }
    : {
        email: {
          required: helpers.withMessage(
            t("errors.EMAIL_REQUIRED_FIELD"),
            required
          ),
        },
        password: {
          required: helpers.withMessage(
            t("errors.PASSWORD_REQUIRED_FIELD"),
            required
          ),
        },
      };
});

const formErrors = computed(() =>
  handleValidationErrors<IForm>(v$.value.$errors)
);

const handleShowPassword = () => {
  return (showPassword.value = !showPassword.value);
};

const v$ = useVuelidate(rules, formData);

const submitForm = async (): Promise<void> => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    isLoading.value = true;

    try {
      if (route.fullPath === ROUTES.SIGN_IN.PATH) {
        await authStore.loginUser(formData.email, formData.password);
      } else {
        await authStore.registerUser(formData.email, formData.password);
      }

      localStorage.setItem("wasAuthorized", "true");

      router.push(ROUTES.MAIN.PATH);
    } catch (err: unknown) {
      if (err instanceof Error) {
        serverError.value = t(`errors.${err.message}`);
      }
    } finally {
      isLoading.value = false;
    }
  } else {
    return;
  }
};
</script>

<style lang="scss" scoped>
.auth {
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 615px;
  margin: 0 auto;
  justify-content: flex-start;
  align-items: center;
  min-height: 400px;
  &__title {
    @include default-text(34px, 1.2);
    color: var(--color-text);
  }
  &__subtitle {
    @include default-text(16px, 1.235);
    color: var(--color-text);
  }
  &__form {
    width: 90%;
    padding-top: 20px;
    text-align: center;
    &auth__input {
      width: 100%;
    }
    .auth__button {
      font-family: $font-roboto;
      font-size: 14px;
      line-height: 1.235;
      width: 100%;
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
  &__form-error {
    height: 40px;
    margin: 5px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-error);
    padding: 0 15px 0 15px;
  }
  &__form-error-text {
    margin: 0;
    font-size: 12px;
  }
  &__link {
    text-decoration: none;
    color: var(--color-text-red);
  }
  &__link:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

:deep(.auth__input .v-field__outline__start) {
  border-radius: 0;
  transition: 0.3s;
}
:deep(.auth__input .v-field__outline__end) {
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
:deep(.auth__input .v-field__outline__notch::before) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::before) {
  border-top: 1px solid var(--color-input-borders);
}
:deep(.auth__input .v-field__outline__notch::after) {
  transition: 0.3s;
}
:deep(.v-field--focused .v-field__outline__notch::after) {
  border-bottom: 1px solid var(--color-input-borders);
}
:deep(.auth__input .v-field-label) {
  transition: background-color 0.3s;
}
:deep(.v-field--focused .v-field-label) {
  color: var(--color-active-text);
}
</style>
