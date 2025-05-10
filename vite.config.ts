import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from 'node:url'
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@auth': fileURLToPath(new URL('./packages/auth/src', import.meta.url)),
            '@admin': fileURLToPath(new URL('./packages/admin/src', import.meta.url)),
            '@professor': fileURLToPath(new URL('./packages/professor/src', import.meta.url)),
            '@student': fileURLToPath(new URL('./packages/student/src', import.meta.url)),
            '@src': fileURLToPath(new URL('./packages/src', import.meta.url)),
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
