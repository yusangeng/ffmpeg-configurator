import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ffmpeg-configurator/', // GitHub Pages base path
  build: {
    outDir: 'docs' // Output to docs directory for GitHub Pages
  }
})
