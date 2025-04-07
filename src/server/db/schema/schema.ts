import { sql } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  age: integer('age'),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const timeEntry = sqliteTable(
  'time_entry',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    // projectId: text('project_id'),
    taskId: text('task_id').references(() => task.id, { onDelete: 'set null' }),
    description: text('description'),
    startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
    endTime: integer('end_time', { mode: 'timestamp' }),
    durationMinutes: integer('duration_minutes'),
    billable: integer('billable', { mode: 'boolean' }).notNull().default(true),
    invoiced: integer('invoiced', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [
    index('time_entry_user_id_idx').on(table.userId),
    // projectIdIdx: index('time_entry_project_id_idx').on(table.projectId),
    // taskIdIdx: index('time_entry_task_id_idx').on(table.taskId),
    index('time_entry_start_time_idx').on(table.startTime),
    index('time_entry_end_time_idx').on(table.endTime)
  ]
);

export const taskStatusEnum = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE'
} as const;

export const taskStatusValues = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const;

export const priorityEnum = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const;

export const priorityValues = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

export const task = sqliteTable(
  'task',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    projectId: text('project_id'), // We'll add the reference once the project table is defined
    title: text('title').notNull(),
    description: text('description'),
    status: text('status', { enum: taskStatusValues }).notNull().default(taskStatusEnum.TODO),
    priority: text('priority', { enum: priorityValues }).notNull().default(priorityEnum.MEDIUM),
    estimatedHours: real('estimated_hours'),
    assigneeId: text('assignee_id'), // We'll add the reference once we have the user table
    dueDate: integer('due_date', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [
    index('task_project_id_idx').on(table.projectId),
    index('task_assignee_id_idx').on(table.assigneeId),
    index('task_status_idx').on(table.status),
    index('task_priority_idx').on(table.priority),
    index('task_due_date_idx').on(table.dueDate),
    index('task_title_idx').on(table.title)
  ]
);

export const taskSelectSchema = createSelectSchema(task, {
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
});
export const taskInsertSchema = createInsertSchema(task);
export const taskUpdateSchema = createInsertSchema(task);

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type TimeEntry = typeof timeEntry.$inferSelect;

export type Task = typeof task.$inferSelect;
