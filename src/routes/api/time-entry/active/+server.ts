import { makeClient } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface TimeEntry {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  billable: boolean;
  invoiced: boolean;
}

export const GET: RequestHandler = async ({ url, fetch }) => {
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    // Query your database or API for active time entries
    // This example assumes your API has a way to fetch active time entries
    const response = await makeClient(fetch).api['time-entry'].$get({
      query: {
        userId: userId,
        active: true
      }
    });

    if (!response.ok) {
      return json({ error: 'Failed to fetch active time entries' }, { status: response.status });
    }

    const timeEntries = (await response.json()) as TimeEntry[];

    // If there are active time entries, return the most recent one
    if (timeEntries && timeEntries.length > 0) {
      // Sort by startTime descending to get the most recent
      const activeEntry = timeEntries.sort(
        (a: TimeEntry, b: TimeEntry) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      )[0];

      return json(activeEntry);
    }

    // No active time entries
    return json(null);
  } catch (error) {
    console.error('Error fetching active time entries:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
