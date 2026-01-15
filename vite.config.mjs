import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        optimizeDeps: {
            noDiscovery: true
        },
        plugins: [
            vue(),
            Components({
                dirs: [
                    'app/components',
                    'app/components/**/*.{vue}'
                 ],
                deep: true,
                extensions: ['vue'],
                include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
                exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
                resolvers: [PrimeVueResolver()]
            }),
            createHtmlPlugin({
                minify: true,
                inject: {
                    data: {
                        title: env.VITE_APP_TITLE || 'IcBox Clean',
                        description: env.VITE_APP_DESCRIPTION || 'Sistema de gestão empresarial',
                        lang: env.VITE_APP_LANG || 'pt-BR'
                    }
                }
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./app', import.meta.url))
            }
        }
    };
});
