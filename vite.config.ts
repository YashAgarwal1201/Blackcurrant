import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import {
  writeFileSync,
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
} from "fs";
import { resolve } from "path";

function getBuildVersion() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `v2.${year}.${month}.${day}`;
}

function injectAssetsIntoSW() {
  return {
    name: "inject-assets-into-sw",
    closeBundle() {
      const distDir = resolve("dist");
      const swPath = resolve(distDir, "sw.js");

      const walk = (dir: string, base = ""): string[] =>
        readdirSync(dir).flatMap((f) => {
          const full = `${dir}/${f}`;
          const rel = `${base}/${f}`;
          return statSync(full).isDirectory() ? walk(full, rel) : [rel];
        });

      const assets = walk(distDir)
        .filter((f) =>
          /\.(js|css|html|svg|png|ico|webmanifest|woff2?)$/.test(f),
        )
        .filter((f) => !f.endsWith("/sw.js"))
        .filter((f) => !f.endsWith("/manifest.webmanifest"));

      const sw = readFileSync(swPath, "utf-8");
      const injected = sw.replace(
        'c.addAll(["/", "/index.html"])',
        `c.addAll(${JSON.stringify(["/", ...assets], null, 2)})`,
      );
      writeFileSync(swPath, injected);
      console.log(
        `[inject-assets-into-sw] Injected ${assets.length} assets into sw.js`,
      );
    },
  };
}

const certDir = resolve(process.cwd(), "certs");
const keyPath = resolve(certDir, "petunia-key.pem");
const certPath = resolve(certDir, "petunia.pem");
const hasLocalCerts = existsSync(keyPath) && existsSync(certPath);

const httpsOptions = hasLocalCerts
  ? {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    }
  : undefined;

export default defineConfig(() => ({
  plugins: [react(), injectAssetsIntoSW()],
  base: "/",
  define: {
    __APP_VERSION__: JSON.stringify(getBuildVersion()),
  },
  server: {
    host: true,
    port: 5353,
    ...(httpsOptions ? { https: httpsOptions } : {}),
  },
  preview: {
    host: true,
    port: 5353,
    ...(httpsOptions ? { https: httpsOptions } : {}),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@monaco-editor") || id.includes("monaco-editor")) {
            return "monaco";
          }
          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("react-router-dom")
          ) {
            return "vendor";
          }
        },
      },
    },
  },
}));
