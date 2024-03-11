import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Enable the Vite plugin for React
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // Specify file extensions to resolve
  },
  esbuild:
    "loader: { '.js': 'jsx' }"
});
