import * as auth from '$lib/server/auth';
import { getDB } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!validateEmail(email)) {
      return fail(400, {
        message: 'Invalid email address'
      });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
    }

    const db = getDB(event.platform?.env.DB);
    const results = await db.select().from(table.user).where(eq(table.user.email, email));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, { message: 'Incorrect email or password' });
    }

    const validPassword = await auth.verify(password, existingUser.passwordHash);
    if (!validPassword) {
      return fail(400, { message: 'Incorrect email or password' });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    await db.insert(table.session).values(session);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, '/');
  }
};

function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= 255 && /^[^@]+@[^@]+\.[^@]+$/.test(email);
}

function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
