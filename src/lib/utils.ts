import type { Router } from '@server/api';
import { type ClassValue, clsx } from 'clsx';
import { hc } from 'hono/client';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let browserClient: ReturnType<typeof hc<Router>>;

export const makeClient = (fetch: Window['fetch']) => {
  const isBrowser = typeof window !== 'undefined';
  const origin = isBrowser ? window.location.origin : '';

  if (isBrowser && browserClient) {
    return browserClient;
  }

  const client = hc<Router>(origin, { fetch });

  if (isBrowser) {
    browserClient = client;
  }

  return client;
};
