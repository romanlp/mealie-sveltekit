import { Hono } from 'hono';
import auth from './api/auth.api';
import task from './api/task.api';
import timeEntry from './api/time-entry.api';

const app = new Hono()
  .basePath('/api')
  .route('/', auth)
  .route('/tasks', task)
  .route('/time-entry', timeEntry);

export const api = app;

export type Router = typeof app;
