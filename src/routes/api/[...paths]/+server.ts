import { api } from '@server/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request, platform }) => api.fetch(request, platform?.env);
export const POST: RequestHandler = ({ request, platform }) => api.fetch(request, platform?.env);
