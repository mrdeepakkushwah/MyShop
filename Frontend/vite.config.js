import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "./", // ✅ Important fix
  plugins: [react(), visualizer()],
  server:{
    port:3000,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react";
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
