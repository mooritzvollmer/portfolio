// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        en: resolve(__dirname, 'en/index.html'),
        eneasy: resolve(__dirname, 'en/easy/index.html'),
        leicht: resolve(__dirname, 'leicht/index.html'),
        impressum: resolve(__dirname, 'impressum/index.html'),
        datenschutz: resolve(__dirname, 'datenschutz/index.html'),
        lebenslauf: resolve(__dirname, 'lebenslauf/index.html'),
        kundenstimmen: resolve(__dirname, 'kundenstimmen/index.html'),
        notfound: resolve(__dirname, '404.html'),
      },
    },
  },
})
