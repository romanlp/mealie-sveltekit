import { zValidator } from '@hono/zod-validator';
import { getDB } from '@server/db';
import * as timeEntryQueries from '@server/db/queries/time-entry.queries';
import { Hono } from 'hono';
import { z } from 'zod';

const TimeEntryCreateInput = z.object({
  userId: z.string(),
  taskId: z.string().optional(),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  durationMinutes: z.number().optional(),
  billable: z.boolean().optional(),
  invoiced: z.boolean().optional()
});

const TimeEntryUpdateInput = TimeEntryCreateInput.partial();

const TimeEntryParam = z.object({
  id: z.string()
});

const DateRangeQuery = z.object({
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val))
});

const app = new Hono<{ Bindings: { DB: D1Database } }>()
  .post('/', zValidator('json', TimeEntryCreateInput), async (c) => {
    const db = getDB(c.env.DB);
    const timeEntry = await timeEntryQueries.createTimeEntry(db, c.req.valid('json'));
    return c.json(timeEntry);
  })
  .get('/:id', zValidator('param', TimeEntryParam), async (c) => {
    const db = getDB(c.env.DB);
    const { id } = c.req.valid('param');
    const timeEntry = await timeEntryQueries.getTimeEntryById(db, id);
    if (!timeEntry) {
      return c.json({ message: 'Time entry not found' }, 404);
    }
    return c.json(timeEntry);
  })
  .put(
    '/:id',
    zValidator('param', TimeEntryParam),
    zValidator('json', TimeEntryUpdateInput),
    async (c) => {
      const db = getDB(c.env.DB);
      const { id } = c.req.valid('param');
      const timeEntry = await timeEntryQueries.updateTimeEntry(db, id, c.req.valid('json'));
      if (!timeEntry) {
        return c.json({ message: 'Time entry not found' }, 404);
      }
      return c.json(timeEntry);
    }
  )
  .delete('/:id', zValidator('param', TimeEntryParam), async (c) => {
    const db = getDB(c.env.DB);
    const { id } = c.req.valid('param');
    await timeEntryQueries.deleteTimeEntry(db, id);
    return c.json({ message: 'Time entry deleted' });
  })
  .get('/', async (c) => {
    const db = getDB(c.env.DB);
    const timeEntries = await timeEntryQueries.getAllTimeEntries(db);
    return c.json(timeEntries);
  })
  .get('/task/:taskId', zValidator('param', z.object({ taskId: z.string() })), async (c) => {
    const db = getDB(c.env.DB);
    const { taskId } = c.req.valid('param');
    const timeEntries = await timeEntryQueries.getTimeEntriesByTaskId(db, taskId);
    return c.json(timeEntries);
  })
  .get('/user/:userId', zValidator('param', z.object({ userId: z.string() })), async (c) => {
    const db = getDB(c.env.DB);
    const { userId } = c.req.valid('param');
    const timeEntries = await timeEntryQueries.getTimeEntriesByUserId(db, userId);
    return c.json(timeEntries);
  })
  .get('/date-range', zValidator('query', DateRangeQuery), async (c) => {
    const db = getDB(c.env.DB);
    const { startDate, endDate } = c.req.valid('query');
    const timeEntries = await timeEntryQueries.getTimeEntriesByDateRange(db, startDate, endDate);
    return c.json(timeEntries);
  });

export default app;
