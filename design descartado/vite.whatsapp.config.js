import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build usado só para gerar o HTML único de preview (envio por WhatsApp).
// Não afeta o build normal (vite.config.js) usado no deploy do site.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-whatsapp',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
