import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "./", // Important for relative asset paths in production (e.g., Netlify)

  plugins: [
    react(),
    visualizer({
      open: false, // Set to true if you want to open the visualizer automatically
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  server: {
    port: 3000,
    open: true, // Opens the browser automatically on dev server start
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",

        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom"))
              return "react-vendor";
            if (id.includes("react-router")) return "router";
            if (id.includes("html2canvas") || id.includes("dompurify"))
              return "vendor-libs";
            return "vendor";
          }
        },
      },
    },
  },
});
