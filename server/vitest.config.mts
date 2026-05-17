import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        globalSetup: "./src/tests/helpers/globalSetup.ts",
        setupFiles: ["./src/tests/helpers/setup.ts"],
        fileParallelism: false,
        exclude: ["dist/**", "node_modules/**"],
    },
});
