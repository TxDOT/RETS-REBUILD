import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  assetsInclude:['**/*.svg'],
  //base: '/apps/statewide_mapping/rets_rebuild/',
  server:{
    host: "L-DS755X3.dot.state.tx.us"
  }
})
