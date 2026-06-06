import * as path from 'path';
import autoprefixer from 'autoprefixer';

/** @type {import('vite').UserConfig} */
export default {
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
        minify: true,
        ssr: true,
    },
    ssr: {},
    css: {
        postcss: {
            plugins: [autoprefixer({})],
        },
    },
};
