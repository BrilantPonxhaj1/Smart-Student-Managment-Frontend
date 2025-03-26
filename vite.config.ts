// import vue from '@vitejs/plugin-vue';
// import autoprefixer from 'autoprefixer';
// import laravel from 'laravel-vite-plugin';
// import path from 'path';
// import tailwindcss from 'tailwindcss';
// import { defineConfig } from 'vite';
//
// export default defineConfig({
//     plugins: [
//         laravel({
//             input: ['resources/js/app.ts'],
//             refresh: true,
//         }),
//         vue({
//             template: {
//                 transformAssetUrls: {
//                     base: null,
//                     includeAbsolute: false,
//                 },
//             },
//         }),
//     ],
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, './resources/js'),
//         },
//     },
//     css: {
//         postcss: {
//             plugins: [tailwindcss, autoprefixer],
//         },
//     },
// });



import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        open: '/welcome',
        port: 3000,
host: true
},
build: {
    outDir: 'dist',
        emptyOutDir: true
}
})