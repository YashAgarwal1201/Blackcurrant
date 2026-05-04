import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

function getBuildVersion() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `v2.${year}.${month}.${day}`;
}

export default defineConfig({
  plugins: [react()],
  base: "/",
  define: {
    __APP_VERSION__: JSON.stringify(getBuildVersion()),
  },
  server: {
    host: true,
    port: 5353,
  },
  preview: {
    host: true,
    port: 5353,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      external: ["chart.js/auto"],
      output: {
        manualChunks: {
          monaco: ["@monaco-editor/react"],
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
