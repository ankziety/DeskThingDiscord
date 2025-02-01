import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "server/*.test.ts"],
    environment: "jsdom",
  },
});
