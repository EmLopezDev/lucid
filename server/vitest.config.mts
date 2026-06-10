import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        globalSetup: "./src/test-helpers/globalSetup.ts",
        setupFiles: ["./src/test-helpers/setup.ts"],
        fileParallelism: false,
        testTimeout: 15000,
        exclude: ["dist/**", "node_modules/**"],
    },
});
