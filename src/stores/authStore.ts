import { defineStore } from 'pinia';
import client from '../boot/axios';
import { isAxiosError } from 'axios';

interface User {
  id: number;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await client.post('/api/login', { email, password });
        this.token = response.data.access_token;
        this.user = response.data.user;

        localStorage.setItem('token', this.token);
      } catch (error) {
        throw new Error('Login failed');
      }
    },

    async register(name: string, email: string, password: string) {
      try {
        const response = await client.post('/api/register', { name, email, password });
        const token = await client.post('/api/login', { email, password });        
        this.token = token.data.access_token;
        this.user = response.data.user;
        localStorage.setItem('token', this.token);
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          const errorMessage = error.response.data.message || 'Registration failed';
          throw new Error(errorMessage);
        } else {
          throw new Error('An unexpected error occurred');
        }
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },

    loadToken() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        client.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    }
  },
});
