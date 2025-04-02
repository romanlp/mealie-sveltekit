import { makeClient } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  login: async ({ request, fetch }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await makeClient(fetch).api.login.$post({ form: { email, password } });
    console.log('result', result);

    if (result.status === 404) {
      const data = await result.json();
      return fail(400, { message: data.message });
    }

    return redirect(302, '/');
  }
};
