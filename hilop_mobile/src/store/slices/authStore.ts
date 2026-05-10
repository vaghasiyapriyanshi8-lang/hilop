import { create } from 'zustand';
import { User } from '../../types';
import { storage } from '../../utils/storage';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  accessToken: storage.getString('accessToken') ?? null,
  isAuthenticated: !!storage.getString('accessToken'),
  setAuth: (user, accessToken, refreshToken) => {
    storage.set('accessToken', accessToken);
    storage.set('refreshToken', refreshToken);
    set({ user, accessToken, isAuthenticated: true });
  },
  logout: () => {
    storage.delete('accessToken');
    storage.delete('refreshToken');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
  updateUser: user =>
    set(state => ({ user: state.user ? { ...state.user, ...user } : null })),
}));