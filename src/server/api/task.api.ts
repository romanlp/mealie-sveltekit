import { zValidator } from '@hono/zod-validator';
import { getDB } from '@server/db';
import * as taskQueries from '@server/db/queries/task.queries';
import * as table from '@server/db/schema/schema';
import { Hono } from 'hono';
import { z } from 'zod';

const TaskCreateInput = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string().optional(),
  status: z.enum(table.taskStatusValues).optional(),
  priority: z.enum(table.priorityValues).optional(),
  estimatedHours: z.number().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.date().optional()
});

const TaskUpdateInput = TaskCreateInput.partial();

const TaskParam = z.object({
  id: z.string()
});

const app = new Hono<{ Bindings: { DB: D1Database } }>()
  .post('/', zValidator('json', TaskCreateInput), async (c) => {
    const db = getDB(c.env.DB);
    const task = await taskQueries.createTask(db, c.req.valid('json'));
    return c.json(task);
  })
  .get('/:id', zValidator('param', TaskParam), async (c) => {
    const db = getDB(c.env.DB);
    const { id } = c.req.valid('param');
    const task = await taskQueries.getTaskById(db, id);
    if (!task) {
      return c.json({ message: 'Task not found' }, 404);
    }
    return c.json(task);
  })
  .put('/:id', zValidator('param', TaskParam), zValidator('json', TaskUpdateInput), async (c) => {
    const db = getDB(c.env.DB);
    const { id } = c.req.valid('param');
    const task = await taskQueries.updateTask(db, id, c.req.valid('json'));
    if (!task) {
      return c.json({ message: 'Task not found' }, 404);
    }
    return c.json(task);
  })
  .delete('/:id', zValidator('param', TaskParam), async (c) => {
    const db = getDB(c.env.DB);
    const { id } = c.req.valid('param');
    await taskQueries.deleteTask(db, id);
    return c.json({ message: 'Task deleted' });
  })
  .get('/', async (c) => {
    const db = getDB(c.env.DB);
    const tasks = await taskQueries.getAllTasks(db);
    return c.json(tasks);
  })
  .get(
    '/project/:projectId',
    zValidator('param', z.object({ projectId: z.string() })),
    async (c) => {
      const db = getDB(c.env.DB);
      const { projectId } = c.req.valid('param');
      const tasks = await taskQueries.getTasksByProjectId(db, projectId);
      return c.json(tasks);
    }
  )
  .get(
    '/assignee/:assigneeId',
    zValidator('param', z.object({ assigneeId: z.string() })),
    async (c) => {
      const db = getDB(c.env.DB);
      const { assigneeId } = c.req.valid('param');
      const tasks = await taskQueries.getTasksByAssigneeId(db, assigneeId);
      return c.json(tasks);
    }
  )
  .get(
    '/status/:status',
    zValidator('param', z.object({ status: z.enum(table.taskStatusValues) })),
    async (c) => {
      const db = getDB(c.env.DB);
      const { status } = c.req.valid('param');
      const tasks = await taskQueries.getTasksByStatus(db, status);
      return c.json(tasks);
    }
  )
  .get(
    '/priority/:priority',
    zValidator('param', z.object({ priority: z.enum(table.priorityValues) })),
    async (c) => {
      const db = getDB(c.env.DB);
      const { priority } = c.req.valid('param');
      const tasks = await taskQueries.getTasksByPriority(db, priority);
      return c.json(tasks);
    }
  );

export default app;
