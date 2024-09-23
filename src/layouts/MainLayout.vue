<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Smart Wallet IA
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>Smart Wallet IA</q-item-label>

        <!-- Enlaces esenciales según estado de autenticación -->
        <EssentialLink
          v-for="link in filteredLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import EssentialLink, { EssentialLinkProps } from '../components/EssentialLink.vue';
import { useAuthStore } from '../stores/authStore';

defineOptions({
  name: 'MainLayout'
});

const authStore = useAuthStore();

const linksList: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    caption: 'Wallet Overview',
    icon: 'dashboard',
    link: 'dashboard',
    requiresAuth: true,
  },
  {
    title: 'Log out',
    caption: 'Exit the application',
    icon: 'logout',
    link: 'logout',
    requiresAuth: true,
  },
  {
    title: 'Login',
    caption: 'Access your account',
    icon: 'login',
    link: '/',
    requiresAuth: false,
  },
  {
    title: 'Register',
    caption: 'Create a new account',
    icon: 'person_add',
    link: 'register',
    requiresAuth: false,
  },
];

const filteredLinks = computed(() => {
  return linksList.filter(link => {
    return authStore.isAuthenticated ? link.requiresAuth : !link.requiresAuth;
  });
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
