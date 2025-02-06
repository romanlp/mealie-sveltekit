import * as auth from '$lib/server/auth';
import { getDB } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, '/demo/lucia/login');
  }
  return { user: event.locals.user };
};

export const actions: Actions = {
  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }
    const db = getDB(event.platform?.env.DB);
    await auth.invalidateSession(event.locals.session.id, db);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, '/demo/lucia/login');
  }
};
