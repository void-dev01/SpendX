import { create } from 'zustand';

interface LayoutState {
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  isGlobalSearchOpen: boolean;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toggleMobileDrawer: () => void;
  setGlobalSearchOpen: (open: boolean) => void;
}

const getStoredCollapse = (): boolean => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('spendx_sidebar_collapsed') === 'true';
    }
  } catch {
    // noop
  }
  return false;
};

const setStoredCollapse = (value: boolean): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('spendx_sidebar_collapsed', String(value));
    }
  } catch {
    // noop
  }
};

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: getStoredCollapse(),
  isMobileDrawerOpen: false,
  isGlobalSearchOpen: false,
  toggleSidebarCollapse: () =>
    set((state) => {
      const next = !state.isSidebarCollapsed;
      setStoredCollapse(next);
      return { isSidebarCollapsed: next };
    }),
  setSidebarCollapsed: (collapsed) => {
    setStoredCollapse(collapsed);
    set({ isSidebarCollapsed: collapsed });
  },
  openMobileDrawer: () => set({ isMobileDrawerOpen: true }),
  closeMobileDrawer: () => set({ isMobileDrawerOpen: false }),
  toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  setGlobalSearchOpen: (open) => set({ isGlobalSearchOpen: open }),
}));
