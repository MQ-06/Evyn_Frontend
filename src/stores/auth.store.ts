'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (token: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (token, user) => set({ token, user }),

      updateUser: (user) => set({ user }),

      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'evyn-auth',
      // only persist token and user — nothing sensitive beyond what's needed
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
