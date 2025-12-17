import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: [
			// Provide an ESM wrapper for the CommonJS `ms` package so
			// imports like `import { ms } from 'ms'` work in the Node ESM
			// environment that SvelteKit uses during build/postbuild.
			{ find: 'ms', replacement: path.resolve('./src/shims/ms-compat.js') }
		]
	}
});
