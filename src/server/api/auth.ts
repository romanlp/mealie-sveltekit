import { zValidator } from '@hono/zod-validator';
import * as auth from '@server/auth/lucia-helpers';
import { getDB } from '@server/db';
import { getUserByEmail } from '@server/db/queries/user.queries';
import * as table from '@server/db/schema/schema';
import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import { z } from 'zod';

const Login = z.object({ email: z.string(), password: z.string() });
const Logout = z.object({ sessionId: z.string() });

function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= 255 && /^[^@]+@[^@]+\.[^@]+$/.test(email);
}

function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

const app = new Hono<{ Bindings: { DB: D1Database } }>()
  .get('/register', (c) => {
    return c.text('Register');
  })
  .post('/login', zValidator('form', Login), async (c) => {
    const body = await c.req.parseBody();
    const email = body['email'];
    const password = body['password'];

    if (!validateEmail(email)) {
      return c.json({ message: 'Invalid email address' }, 404);
    }
    if (!validatePassword(password)) {
      return c.json({ message: 'Invalid password (min 6, max 255 characters)' }, 404);
    }
    const db = getDB(c.env.DB);

    const existingUser = await getUserByEmail(db, email);
    if (!existingUser) {
      return c.json({ message: 'Incorrect email or password' }, 404);
    }

    const validPassword = await auth.verify(password, existingUser.passwordHash);
    if (!validPassword) {
      return c.json({ message: 'Incorrect email or password' }, 404);
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    await db.insert(table.session).values(session);

    setCookie(c, auth.sessionCookieName, sessionToken, { expires: session.expiresAt });

    return c.json({ status: 'success' }, 200);
  })
  .post('/logout', zValidator('form', Logout), async (c) => {
    const db = getDB(c.env.DB);
    const body = await c.req.valid('form');
    await auth.invalidateSession(body.sessionId, db);
    deleteCookie(c, auth.sessionCookieName, { path: '/' });
    return c.json({ status: 'success' }, 200);
  });

export default app;
