import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  assetsInclude:['**/*.svg'],
  base: '/apps/statewide_mapping/rets_rebuild_test/',
})
