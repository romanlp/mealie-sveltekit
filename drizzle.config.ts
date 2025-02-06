import { defineConfig } from 'drizzle-kit';
if (!process.env.DB) throw new Error('DB is not set');

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',

  dbCredentials: {
    url: process.env.DB
  },

  verbose: true,
  strict: true,
  dialect: 'sqlite'
});
