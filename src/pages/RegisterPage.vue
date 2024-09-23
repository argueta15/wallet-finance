<template>
  <q-page class="row justify-center items-center">
    <q-card class="q-pa-md" style="max-width: 400px;">
      <q-card-section>
        <div class="text-h6">Register</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="name"
          label="Name"
          filled
          :error="!!nameError"
          :error-message="nameError"
        />
        <q-input
          v-model="email"
          label="Email"
          type="email"
          filled
          :error="!!emailError"
          :error-message="emailError"
        />
        <q-input
          v-model="password"
          label="Password"
          type="password"
          filled
          :error="!!passwordError"
          :error-message="passwordError"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Register" color="primary" @click="handleRegister" />
      </q-card-actions>

      <q-card-section>
        <q-btn flat label="Already have an account? Login" @click="goToLogin" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';

export default defineComponent({
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const nameError = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const handleRegister = async () => {
      try {
        nameError.value = '';
        emailError.value = '';
        passwordError.value = '';

        if (!name.value || !email.value || !password.value) {
          if (!name.value) nameError.value = 'Name is required';
          if (!email.value) emailError.value = 'Email is required';
          if (!password.value) passwordError.value = 'Password is required';
          return;
        }

        await authStore.register(name.value, email.value, password.value);
        router.push('/dashboard');
      } catch (error) {
        const axiosError = error as AxiosError;
        emailError.value = axiosError?.message ?? 'Registration failed';
      }
    };

    const goToLogin = () => {
      router.push('/');
    };

    return {
      name,
      email,
      password,
      nameError,
      emailError,
      passwordError,
      handleRegister,
      goToLogin,
    };
  },
});
</script>
