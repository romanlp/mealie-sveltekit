import * as auth from '$lib/server/auth';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { getDB } from '@server/db';
import * as table from '@server/db/schema/schema';
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
  register: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!validateEmail(email)) {
      return fail(400, { message: 'Invalid email address' });
    }
    if (!validateUsername(username)) {
      return fail(400, {
        message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
      });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
    }
    if (password !== confirmPassword) {
      return fail(400, { message: 'Passwords do not match' });
    }

    const db = getDB(event.platform?.env.DB);

    // Check if username already exists
    const existingUsername = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));
    if (existingUsername.length > 0) {
      return fail(400, { message: 'Username already taken' });
    }

    // Check if email already exists (assuming you have an email field in your user table)
    const existingEmail = await db.select().from(table.user).where(eq(table.user.email, email));
    if (existingEmail.length > 0) {
      return fail(400, { message: 'Email already registered' });
    }

    const userId = generateUserId();
    const passwordHash = await auth.hash(password);

    try {
      await db.insert(table.user).values({ id: userId, username, email, passwordHash });

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, userId);
      await db.insert(table.session).values(session);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch (e) {
      console.error(e);
      return fail(500, { message: 'An error occurred while creating your account' });
    }

    return redirect(302, '/');
  }
};

function generateUserId() {
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}

function validateUsername(username: unknown): username is string {
  return (
    typeof username === 'string' &&
    username.length >= 3 &&
    username.length <= 31 &&
    /^[a-z0-9_-]+$/.test(username)
  );
}

function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= 255 && /^[^@]+@[^@]+\.[^@]+$/.test(email);
}
