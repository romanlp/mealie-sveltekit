import * as auth from '@server/auth/lucia-helpers.js';
import { getDB } from '@server/db';
import type { Handle } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get(auth.sessionCookieName);
  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const db = getDB(event.platform?.env.DB);
  const { session, user } = await auth.validateSessionToken(sessionToken, db);
  if (session) {
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    auth.deleteSessionTokenCookie(event);
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};

export const handle: Handle = handleAuth;
