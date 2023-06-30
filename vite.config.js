import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: 'SMMO游戏助手',
        icon: 'https://web.simple-mmo.com/apple-touch-icon.png',
        namespace: 'bmqy.net',
        match: ['https://web.simple-mmo.com/*'],
      },
    }),
  ],
});
