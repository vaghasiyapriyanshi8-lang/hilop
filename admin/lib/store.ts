'use client';

import { create } from 'zustand';

interface AdminState {
  token?: string;
  setToken: (token: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  token: undefined,
  setToken: (token) => set({ token }),
}));
