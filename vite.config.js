import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Göreli yollar: uygulama site kökünde de alt klasörde de (örn. /dart/)
  // sorunsuz çalışsın diye. Varsayılan '/' olsaydı alt klasörde tüm
  // dosyalar 404 verirdi.
  base: './',
  plugins: [react()],
})
