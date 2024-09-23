import { boot } from 'quasar/wrappers';
import { useAuthStore } from '../stores/authStore';

export default boot(() => {
  const authStore = useAuthStore();
  authStore.loadToken();
});