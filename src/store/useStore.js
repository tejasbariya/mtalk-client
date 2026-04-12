import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('mtalk_token', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('mtalk_token');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'mtalk-auth', // key in localStorage
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
