import * as auth from '$lib/server/auth';
import { getDB } from '@server/db';
import * as table from '@server/db/schema/schema';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';

function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= 255 && /^[^@]+@[^@]+\.[^@]+$/.test(email);
}

function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.get('/register', (c) => {
  return c.text('Register');
});

app.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const email = body['email'];
  const password = body['password'];

  if (!validateEmail(email)) {
    return c.json({ message: 'Invalid email address' }, 404);
  }
  if (!validatePassword(password)) {
    return c.json({ message: 'Invalid password (min 6, max 255 characters)' }, 404);
  }
  console.log('ss', c.env);
  const db = getDB(c.env.DB);
  const results = await db.select().from(table.user).where(eq(table.user.email, email));

  const existingUser = results.at(0);
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

  return c.json({ status: 'success' });
});

export default app;
