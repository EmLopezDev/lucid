import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@models": path.resolve(__dirname, "src/models"),
            "@middleware": path.resolve(__dirname, "src/middleware"),
            "@services": path.resolve(__dirname, "src/services"),
            "@routes": path.resolve(__dirname, "src/routes"),
        },
    },
    test: {
        globals: true,
        environment: "node",
        globalSetup: "./src/tests/helpers/globalSetup.ts",
        setupFiles: ["./src/tests/helpers/setup.ts"],
        fileParallelism: false,
    },
});
