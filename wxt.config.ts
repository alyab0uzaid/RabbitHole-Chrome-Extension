import {defineConfig} from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        permissions: ["sidePanel", "storage", "tabs", "webNavigation"],
        action: {},
        side_panel: {
            default_path: "sidepanel.html"
        },
        name: 'RabbitHole',
        description: 'Track your Wikipedia journey with a visual tree',
        default_locale: "en"
    },
    vite: () => ({
        plugins: [react()],
    }),
});
