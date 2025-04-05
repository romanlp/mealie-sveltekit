import * as table from '@server/db/schema/schema';
import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(table.taskStatusValues).default(table.taskStatusEnum.TODO),
  priority: z.enum(table.priorityValues).default(table.priorityEnum.MEDIUM),
  dueDate: z.string().optional(),
  estimatedHours: z.number().optional()
});

export type FormSchema = typeof formSchema;
