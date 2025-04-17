import { zValidator } from '@hono/zod-validator';
import * as auth from '@server/auth/lucia-helpers';
import { getDB } from '@server/db';
import * as timeEntryQueries from '@server/db/queries/time-entry.queries';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { z } from 'zod';

const TimeEntryCreateInput = z.object({
  userId: z.string(),
  taskId: z.string().optional(),
  description: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional(),
  durationMinutes: z.number().optional(),
  billable: z.boolean().default(true),
  invoiced: z.boolean().default(false)
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
  .get('/actives', async (c) => {
    console.log('ACTIVE');
    const db = getDB(c.env.DB);
    const sessionToken = getCookie(c, auth.sessionCookieName);
    console.log('COOKIE', sessionToken);

    // If no session token is available in the request context
    if (!sessionToken) {
      return c.json({ message: 'Authentication required' }, 401);
    }

    try {
      // Validate the session token and get the user
      const { user } = await auth.validateSessionToken(sessionToken, db);

      if (!user) {
        return c.json({ message: 'Invalid or expired session' }, 401);
      }

      const userId = user.id;
      console.log('COOKIE', user);

      // Get all entries for this user
      const timeEntries = await timeEntryQueries.getTimeEntriesByUserId(db, userId);

      // Find entries that have a startTime but no endTime (active entries)
      const activeEntries = timeEntries.filter((entry) => entry.startTime && !entry.endTime);

      // If there are active entries, return the most recent one
      if (activeEntries.length > 0) {
        // Sort by startTime descending to get most recent
        const mostRecentEntry = activeEntries.sort(
          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        )[0];

        return c.json(mostRecentEntry);
      }

      // No active entries found
      return c.json({ message: 'No active time entry found' }, 404);
    } catch (error) {
      console.error('Authentication error:', error);
      return c.json({ message: 'Authentication failed' }, 401);
    }
  })
  .post('/', zValidator('json', TimeEntryCreateInput), async (c) => {
    const db = getDB(c.env.DB);
    const userId = getCookie(c, auth.sessionCookieName);
    console.log('COOKIE', userId);
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
  .get('/user/:userId', zValidator('param', z.object({ userId: z.string() })), async (c) => {
    const db = getDB(c.env.DB);
    const { userId } = c.req.valid('param');
    const timeEntries = await timeEntryQueries.getTimeEntriesByUserId(db, userId);
    return c.json(timeEntries);
  })
  .get('/task/:taskId', zValidator('param', z.object({ taskId: z.string() })), async (c) => {
    const db = getDB(c.env.DB);
    const { taskId } = c.req.valid('param');
    const timeEntries = await timeEntryQueries.getTimeEntriesByTaskId(db, taskId);
    return c.json(timeEntries);
  })
  .get('/date-range', zValidator('query', DateRangeQuery), async (c) => {
    const db = getDB(c.env.DB);
    const { startDate, endDate } = c.req.valid('query');
    const timeEntries = await timeEntryQueries.getTimeEntriesByDateRange(db, startDate, endDate);
    return c.json(timeEntries);
  });

export default app;
