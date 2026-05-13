import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  accentColor: string;
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: (typeof window !== 'undefined' ? (localStorage.getItem('theme') as 'light' | 'dark') : 'light') || 'light',
  accentColor: (typeof window !== 'undefined' ? localStorage.getItem('accentColor') : '#3b82f6') || '#3b82f6',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accentColor', action.payload);
        document.documentElement.style.setProperty('--color-primary', action.payload);
      }
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setTheme, setAccentColor } = uiSlice.actions;
export default uiSlice.reducer;
