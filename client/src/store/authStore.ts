import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

interface User {
  username: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/api/auth/login', { username, password });
          
          if (response.data.success) {
            set({
              isAuthenticated: true,
              user: response.data.user,
              loading: false,
              error: null,
            });
            return true;
          }
          
          set({ 
            loading: false, 
            error: 'Login failed',
            isAuthenticated: false,
            user: null,
          });
          return false;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
          set({ 
            loading: false, 
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });
          return false;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await api.post('/api/auth/logout');
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });
        } catch (error) {
          // Even if logout fails on backend, clear local state
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        set({ loading: true });
        try {
          const response = await api.get('/api/auth/me');
          
          if (response.data.isAuthenticated) {
            set({
              isAuthenticated: true,
              user: response.data.user,
              loading: false,
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
              loading: false,
            });
          }
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
