import { create } from "zustand";

interface UIState {
  soundOn: boolean;
  soundArmed: boolean; // preferencia ON recordada, esperando primer gesto
  menuOpen: boolean;
  sheet: string | null;
  introPlaying: boolean;
  toast: { id: number; text: string } | null;
  navSurface: "brand" | "light";
  activeNav: string | null;
  setSound: (on: boolean, armed?: boolean) => void;
  setMenu: (open: boolean) => void;
  openSheet: (id: string) => void;
  closeSheet: () => void;
  setIntroPlaying: (v: boolean) => void;
  showToast: (text: string) => void;
  setNavSurface: (s: "brand" | "light") => void;
  setActiveNav: (id: string | null) => void;
}

export const useUI = create<UIState>((set) => ({
  soundOn: false,
  soundArmed: false,
  menuOpen: false,
  sheet: null,
  introPlaying: false,
  toast: null,
  navSurface: "brand",
  activeNav: null,
  setSound: (on, armed = false) => set({ soundOn: on, soundArmed: armed }),
  setMenu: (open) => set({ menuOpen: open }),
  openSheet: (id) => set({ sheet: id }),
  closeSheet: () => set({ sheet: null }),
  setIntroPlaying: (v) => set({ introPlaying: v }),
  showToast: (text) => set({ toast: { id: Date.now(), text } }),
  setNavSurface: (s) => set({ navSurface: s }),
  setActiveNav: (id) => set({ activeNav: id }),
}));
