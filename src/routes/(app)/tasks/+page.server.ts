import { makeClient } from '$lib/utils';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './TaskForm/form.schema';

export const load: PageServerLoad = async ({ fetch }) => {
  const result = await makeClient(fetch).api.tasks.$get();
  const form = await superValidate(zod(formSchema));

  return { tasks: await result.json(), form };
};

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const form = await superValidate(request, zod(formSchema));

    if (!form.valid) {
      return { form };
    }

    const response = await fetch('/api/task', {
      method: 'POST',
      body: JSON.stringify(form.data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { form };
    }

    return { form };
  }
};
