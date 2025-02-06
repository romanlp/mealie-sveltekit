import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
if (!env.DB) throw new Error('DB is not set');
const client = createClient({ url: env.DB });
export const db = drizzle(client);
