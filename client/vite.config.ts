import { defineConfig } from "vitest/config";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

function cspPlugin() {
    return {
        name: "csp",
        transformIndexHtml(html: string, ctx: { command: string }) {
            if (ctx.command !== "build") return html;
            const csp = [
                "default-src 'self'",
                "script-src 'self'",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                "font-src 'self' https://fonts.gstatic.com",
                "connect-src 'self' https://sentry.io https://*.sentry.io",
                "img-src 'self' data:",
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'",
            ].join("; ");
            return html.replace(
                "<head>",
                `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
            );
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        cspPlugin(),
        sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
        }),
    ],
    base: "/",
    resolve: {
        alias: {
            "@lucid/types": path.resolve(__dirname, "../packages/types/index.ts"),
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/tests/setup.ts"],
    },
});
