import * as table from '@server/db/schema/schema';
import { eq } from 'drizzle-orm';
import type { getDB } from '..';

export const getUserByEmail = async (db: ReturnType<typeof getDB>, email: string) => {
  const results = await db.select().from(table.user).where(eq(table.user.email, email));
  return results.at(0);
};
