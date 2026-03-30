import { create } from 'zustand';

export type Theme = 'light';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

interface AppState {
  sidebarOpen: boolean;
  theme: Theme;
  currentUser: CurrentUser;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  currentUser: {
    id: 'usr-001',
    name: 'Ahmad Razif',
    email: 'ahmad.razif@digitalpmo.my',
    role: 'PMO Lead',
    avatarUrl: '',
  },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));
