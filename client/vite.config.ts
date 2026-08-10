import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      "@emotion/react",
      "@emotion/styled",
      "html2canvas",
      "jspdf",
      "void-elements",
    ],
  },
  build: {
    rollupOptions: {
      external: ["canvg"],
    },
  },
  define: {
    global: "window", // fix lỗi undefined cho SockJS mới kết nối được
  },
});
