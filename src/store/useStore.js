import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token });
      },
      setUser: (user) => {
        set({ user });
      },
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'mtalk-auth', // key in localStorage
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
