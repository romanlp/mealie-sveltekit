import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    console.log('db sveltekit', event.platform?.env.DB);
    const result = await event.fetch('/api/login', {
      method: 'POST',
      body: await event.request.formData()
    });

    const data = await result.json<{ message: string }>();
    console.log('result', data);

    if (!result.ok) {
      return fail(400, { message: data.message });
    }

    return redirect(302, '/');
  }
};
