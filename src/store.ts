import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppSettings {
  activeTheme: string;
  themeFile: string;
  uiScale: number;
  ezMode: boolean;
}

interface AppState {
  settings: AppSettings;
  setSettings: (s: Partial<AppSettings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      settings: {
        activeTheme: "default",
        themeFile: "",
        uiScale: 1.2,
        ezMode: false,
      },
      setSettings: (s) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),
    }),
    {
      name: "ux-baseline-state",
      version: 3,
      migrate: (state: any, version: number) => {
        if (version < 2 && state.settings?.uiScale === 1.0) {
          state.settings.uiScale = 1.2;
        }
        return state;
      },
    }
  )
);
