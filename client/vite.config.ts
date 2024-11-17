import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      }
    },
    server: {
      port: process.env.VITE_PORT ? +process.env.VITE_PORT : 3000,
    },
  })
}
