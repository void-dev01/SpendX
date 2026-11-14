import { create } from 'zustand';
import { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const getStorageItem = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // fallback
  }
  return null;
};

const setStorageItem = (key: string, value: string | null): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (value) {
        window.localStorage.setItem(key, value);
      } else {
        window.localStorage.removeItem(key);
      }
    }
  } catch {
    // fallback
  }
};

const initialToken = getStorageItem('spendx_auth_token');

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  setToken: (token) => {
    setStorageItem('spendx_auth_token', token);
    set({ token, isAuthenticated: Boolean(token) });
  },
  logout: () => {
    setStorageItem('spendx_auth_token', null);
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
