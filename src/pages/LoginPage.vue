<template>
  <q-page class="row justify-center items-center">
    <q-card class="q-pa-md" style="max-width: 400px;">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
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
        <q-btn label="Login" color="primary" @click="handleLogin" />
      </q-card-actions>

      <q-card-section>
        <q-btn flat label="Don't have an account? Register" @click="goToRegister" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
      try {
        emailError.value = '';
        passwordError.value = '';

        if (!email.value || !password.value) {
          if (!email.value) emailError.value = 'Email is required';
          if (!password.value) passwordError.value = 'Password is required';
          return;
        }

        await authStore.login(email.value, password.value);
        router.push('dashboard');
      } catch (error) {
        console.error(error);
        emailError.value = 'Invalid email or password';
      }
    };

    const goToRegister = () => {
      router.push('register');
    };

    return {
      email,
      password,
      emailError,
      passwordError,
      handleLogin,
      goToRegister,
    };
  },
});
</script>
