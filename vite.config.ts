import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@auth': fileURLToPath(new URL('./packages/auth/src', import.meta.url))
        }
    },
    server: {
        open: '/login',
        port: 3000,
        host: true
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true
    }
})
