import { makeClient } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const result = await makeClient(fetch).api.tasks.$get();
  return { tasks: await result.json() };
};
