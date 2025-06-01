import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import tailwindcss from "@tailwindcss/vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import path from "path"

export default defineConfig({
	plugins: [
		svelte(),
		tailwindcss(),
		cssInjectedByJsPlugin(),
		nodePolyfills({
			globals: {
				Buffer: true
			}
		})
	],
	build: {
		assetsDir: "",
		rollupOptions: {
			output: {
				entryFileNames: "openapi-renderer.js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name][extname]"
			}
		}
	},
	resolve: {
		alias: {
			$lib: path.resolve("./src/lib")
		}
	}
})
