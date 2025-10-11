import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const plugins = [react()];

  // Bundle analyzer - only load if ANALYZE env is set
  if (process.env.ANALYZE) {
    try {
      const { visualizer } = await import("rollup-plugin-visualizer");
      plugins.push(
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: "dist/stats.html",
          template: "treemap",
        })
      );
    } catch (e) {
      console.warn("rollup-plugin-visualizer not available, skipping bundle analysis");
    }
  }

  // Gzip compression
  plugins.push(
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      deleteOriginFile: false,
    })
  );

  // Brotli compression (better compression)
  plugins.push(
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      deleteOriginFile: false,
    })
  );

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "react-vendor": ["react", "react-dom", "react-router-dom"],

          // UI Libraries - Split into smaller chunks
          "ui-radix-1": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-select",
          ],
          "ui-radix-2": [
            "@radix-ui/react-tabs",
            "@radix-ui/react-slider",
            "@radix-ui/react-toggle",
          ],
          "ui-radix-3": [
            "@radix-ui/react-toast",
            "@radix-ui/react-progress",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-avatar",
          ],

          // Heavy libraries
          "charts": ["recharts"],
          "animation": ["framer-motion"],
          "forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "supabase": ["@supabase/supabase-js"],
          "query": ["@tanstack/react-query"],
          "date": ["date-fns"],
          "icons": ["lucide-react"],

          // Utilities
          "utils": [
            "clsx",
            "tailwind-merge",
            "class-variance-authority",
          ],
        },
        // Better chunk naming for debugging
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 600,
    },
  };
});
