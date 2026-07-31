import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": "/app",
    },
  },
  // Bind IPv4+IPv6 so Cursor preview (often 127.0.0.1) is not refused when
  // Node only listens on ::1.
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
});
