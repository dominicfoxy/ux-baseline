import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Tauri dev server settings
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      // Tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
