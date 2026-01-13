import { create } from "zustand";

interface UIState {
  isStyleSidebarOpen: boolean;
  openStyleSidebar: () => void;
  closeStyleSidebar: () => void;
  toggleStyleSidebar: () => void;
  customBackground: string | null;
  setCustomBackground: (background: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isStyleSidebarOpen: false,
  openStyleSidebar: () => set({ isStyleSidebarOpen: true }),
  closeStyleSidebar: () => set({ isStyleSidebarOpen: false }),
  toggleStyleSidebar: () =>
    set((state) => ({ isStyleSidebarOpen: !state.isStyleSidebarOpen })),
  customBackground: null,
  setCustomBackground: (background) => set({ customBackground: background }),
}));
