import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    cors: {
      origin: "http://localhost:4000", // Match your backend
      credentials: true,
    },
  },
});
