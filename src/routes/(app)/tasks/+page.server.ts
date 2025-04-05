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

    console.log('form.data', form);

    if (!form.valid) {
      console.log('form is not valid');
      return { form };
    }

    const response = await makeClient(fetch).api.tasks.$post({
      json: form.data
    });

    if (!response.ok) {
      return { form };
    }

    return { form };
  }
};
