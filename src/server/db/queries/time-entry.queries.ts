import * as table from '@server/db/schema/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import type { getDB } from '..';

type CreateTimeEntry = typeof table.timeEntry.$inferInsert;

export const createTimeEntry = async (db: ReturnType<typeof getDB>, timeEntry: CreateTimeEntry) => {
  const result = await db.insert(table.timeEntry).values(timeEntry).returning();
  return result[0];
};

export const getTimeEntryById = async (db: ReturnType<typeof getDB>, id: string) => {
  const result = await db.select().from(table.timeEntry).where(eq(table.timeEntry.id, id));
  return result[0] || null;
};

export const updateTimeEntry = async (
  db: ReturnType<typeof getDB>,
  id: string,
  timeEntry: Partial<CreateTimeEntry>
) => {
  const result = await db
    .update(table.timeEntry)
    .set({ ...timeEntry, updatedAt: new Date() })
    .where(eq(table.timeEntry.id, id))
    .returning();
  return result[0] || null;
};

export const deleteTimeEntry = async (db: ReturnType<typeof getDB>, id: string) => {
  await db.delete(table.timeEntry).where(eq(table.timeEntry.id, id));
};

export const getAllTimeEntries = async (db: ReturnType<typeof getDB>) => {
  return await db.select().from(table.timeEntry);
};

export const getTimeEntriesByTaskId = async (db: ReturnType<typeof getDB>, taskId: string) => {
  return await db.select().from(table.timeEntry).where(eq(table.timeEntry.taskId, taskId));
};

export const getTimeEntriesByUserId = async (db: ReturnType<typeof getDB>, userId: string) => {
  return await db.select().from(table.timeEntry).where(eq(table.timeEntry.userId, userId));
};

export const getTimeEntriesByDateRange = async (
  db: ReturnType<typeof getDB>,
  startDate: Date,
  endDate: Date
) => {
  return await db
    .select()
    .from(table.timeEntry)
    .where(and(gte(table.timeEntry.startTime, startDate), lte(table.timeEntry.endTime, endDate)));
};
