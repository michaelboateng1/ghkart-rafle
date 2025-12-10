import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	out: './drizzel',
	schema: './src/lib/server/db/schemas/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: process.env.DATABASE_URL! },
	verbose: true,
	strict: true
});