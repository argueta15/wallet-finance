<template>
  <q-page class="row justify-center items-center">
    <q-card class="q-pa-md" style="max-width: 400px;">
      <q-card-section>
        <div class="text-h6">Logging Out...</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    onMounted(() => {
      authStore.logout();
      router.push('/');
    });

    return {};
  },
});
</script>
