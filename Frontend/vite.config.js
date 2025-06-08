import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: "./", // ✅ Needed for relative paths on Vercel
  plugins: [react()],
  ...(command === "serve" && {
    server: {
      port: 3000,
      open: true,
      strictPort: true,
      cors: {
        origin: "http://localhost:4000",
        credentials: true,
      },
    },
  }),
  build: {
    outDir: "dist",
  },
}));
