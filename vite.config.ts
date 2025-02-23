import { defineConfig } from 'vite';
import * as path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    resolve: {
        alias: {
            '@src': path.resolve(import.meta.dirname, 'src'),
        },
    },
    build: {
        outDir: 'build',
        rollupOptions: {
            input: path.resolve(import.meta.dirname, 'src', 'index.ts'),
        },
        ssr: true,
    },
    ssr: {},
    css: {
        postcss: {
            plugins: [autoprefixer({})],
        },
    },
});
