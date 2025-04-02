import { makeClient } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  if (!locals.user) {
    return redirect(302, '/login');
  }
  if (!locals.session) {
    return fail(401);
  }

  const client = makeClient(fetch);
  await client.api.logout.$post({ form: { sessionId: locals.session.id } });

  return redirect(302, '/login');
};
