import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  ...(command === "serve" && {
    server: {
      port: 3000,
      open: true,
      strictPort: true,
      cors: {
        origin: "http://localhost:4000", // Your backend URL
        credentials: true,
      },
    },
  }),
  build: {
    outDir: "dist",
  },
}));
