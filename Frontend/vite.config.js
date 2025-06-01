import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true, // Automatically opens browser on start
    strictPort: true, // Fails if port 3000 is busy instead of picking another
    cors: true, // Enable CORS if you call APIs from other origins
  },
});
