<template>
  <div class="auth">
    <h1 class="auth__title">{{ props.title }}</h1>
    <form @submit.prevent="submitForm" class="auth__form" novalidate>
      <div class="auth__lable">
        <label>
          <input
            v-model="formData.email"
            type="email"
            name="email"
            class="auth__input"
            placeholder="Your email address"
            autocomplete="on"
          />
        </label>
        <div class="input__errors">
          <p
            v-for="err in v$.email.$errors"
            :key="err.$uid"
            class="auth__input-error"
          >
            {{ err.$message }}
          </p>
        </div>
      </div>
      <div class="auth__lable">
        <label>
          <input
            v-model="formData.password"
            type="password"
            name="password"
            class="auth__input"
            placeholder="Password"
            autocomplete="on"
          />
        </label>
        <div class="input__errors">
          <p
            v-for="err in v$.password.$errors"
            :key="err.$uid"
            class="auth__input-error"
          >
            {{ err.$message }}
          </p>
        </div>
      </div>
      <div class="auth__form-error">
        <p v-if="error" class="auth__form-error-text">{{ error }}</p>
      </div>
      <button
        type="submit"
        class="auth__button"
        :disabled="isLoading || v$.$errors.length > 0"
      >
        {{ props.buttonText }}
      </button>
    </form>
    <p class="auth__subtitle">
      {{ props.subtitleText }}
      <router-link to="/sign-up" class="auth__link">{{
        props.linkText
      }}</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, minLength, email, helpers } from "@vuelidate/validators";
import {
  EMAIL_REQUIRED_FIELD,
  EMAIL_TYPE_FIELD,
  PASSWORD_MINLENGTH_FIELD,
  PASSWORD_REQUIRED_FIELD,
} from "../constants/errorMessage";

const props = defineProps({
  title: { type: String, required: true },
  buttonText: { type: String, required: true },
  subtitleText: { type: String, required: true },
  linkText: { type: String, required: true },
});

const route = useRoute();
const router = useRouter();

const formData = reactive({
  email: "",
  password: "",
});
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage(EMAIL_REQUIRED_FIELD, required),
      email: helpers.withMessage(EMAIL_TYPE_FIELD, email),
    },
    password: {
      required: helpers.withMessage(PASSWORD_REQUIRED_FIELD, required),
      minLength: helpers.withMessage(PASSWORD_MINLENGTH_FIELD, minLength(6)),
    },
  };
});

const v$ = useVuelidate(rules, formData);

// const handleAuthRoute = computed<string>(() => {
//   return route.fullPath === "/signin" ? "/register" : "/signin";
// });

// const submitForm = async (): Promise<void> => {
//   const isFormCorrect = await v$.value.$validate();

//   if (isFormCorrect) {
//     isLoading.value = true;

//     try {
//       if (route.fullPath === "/signin") {
//         await authStore.loginUser(formData.email, formData.password);
//       } else {
//         await authStore.registerUser(formData.email, formData.password);
//       }
//       router.push("/");
//     } catch (err) {
//       error.value = err.message;
//     } finally {
//       isLoading.value = false;
//     }
//   } else {
//     return;
//   }
// };
</script>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  max-width: 560px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  /* height: 100%; */
}
</style>
