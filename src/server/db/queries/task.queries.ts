import * as table from '@server/db/schema/schema';
import { eq } from 'drizzle-orm';
import type { getDB } from '..';

type CreateTask = typeof table.task.$inferInsert;
type UpdateTask = Partial<CreateTask>;

export const createTask = async (db: ReturnType<typeof getDB>, task: CreateTask) => {
  const result = await db.insert(table.task).values(task).returning();
  return result[0];
};

export const getTaskById = async (db: ReturnType<typeof getDB>, id: string) => {
  const result = await db.select().from(table.task).where(eq(table.task.id, id));
  return result[0] || null;
};

export const updateTask = async (db: ReturnType<typeof getDB>, id: string, task: UpdateTask) => {
  const result = await db
    .update(table.task)
    .set({ ...task, updatedAt: new Date() })
    .where(eq(table.task.id, id))
    .returning();
  return result[0] || null;
};

export const deleteTask = async (db: ReturnType<typeof getDB>, id: string) => {
  await db.delete(table.task).where(eq(table.task.id, id));
};

export const getAllTasks = async (db: ReturnType<typeof getDB>) => {
  return await db.select().from(table.task);
};

export const getTasksByProjectId = async (db: ReturnType<typeof getDB>, projectId: string) => {
  return await db.select().from(table.task).where(eq(table.task.projectId, projectId));
};

export const getTasksByAssigneeId = async (db: ReturnType<typeof getDB>, assigneeId: string) => {
  return await db.select().from(table.task).where(eq(table.task.assigneeId, assigneeId));
};

export const getTasksByStatus = async (
  db: ReturnType<typeof getDB>,
  status: (typeof table.taskStatusValues)[number]
) => {
  return await db.select().from(table.task).where(eq(table.task.status, status));
};

export const getTasksByPriority = async (
  db: ReturnType<typeof getDB>,
  priority: (typeof table.priorityValues)[number]
) => {
  return await db.select().from(table.task).where(eq(table.task.priority, priority));
};
