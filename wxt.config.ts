import {defineConfig} from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        permissions: ["activeTab", "scripting", "sidePanel", "storage", "tabs"],
        action: {},
        name: 'RabbitHole',
        description: 'Wikipedia preview and research tool',
        default_locale: "en"
    },
    vite: () => ({
        plugins: [react()],
    }),
});
