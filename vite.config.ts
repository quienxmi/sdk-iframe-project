import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 4200
    },
    build: {
        sourcemap: true,
        outDir: "./dist",
        lib: {
            entry: './src/index.ts',
            name: 'QxmIframeProject',
            fileName: (format) => `qxm-iframe-project.${format}.js`
        },
        rollupOptions: {
            output: {
                globals: {
                    'qxm-iframe-project': 'QxmIframeProject'
                }
            }
        }
    }
});