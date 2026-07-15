import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// react-draggable (used by react-grid-layout) reads process.env.DRAGGABLE_DEBUG
// at drag start; without this define `process` is undefined in the browser and
// every drag/resize crashes with a ReferenceError.
const DRAGGABLE_DEBUG_DEFINE = { 'process.env.DRAGGABLE_DEBUG': 'false' };

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tailwindcss() as any, react()],
	define: DRAGGABLE_DEBUG_DEFINE,
	optimizeDeps: {
		esbuildOptions: {
			define: DRAGGABLE_DEBUG_DEFINE,
		},
	},
	server: {
		host: '127.0.0.1'
	}
});
