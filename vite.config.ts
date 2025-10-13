import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: true, // allows LAN access if you want to test on a phone
    port: 5353,
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "certs/localhost+2-key.pem")
      ),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost+2.pem")),
    },
  },
  preview: {
    host: true, // allows LAN access if you want to test on a phone
    port: 5353,
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "certs/localhost+2-key.pem")
      ),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost+2.pem")),
    },
  },
});
