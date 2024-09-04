import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    build: {
        outDir: './demo',
        rollupOptions: {
            input: '/test/implementation/index.html'
        }
    },
    plugins: [
        viteSingleFile(),
        createHtmlPlugin({
            minify: true
        })
    ]
});