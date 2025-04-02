<script lang="ts">
  import { enhance } from '$app/forms';
  import LoginForm from '$lib/components/login-form.svelte';
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <form method="post" action="?/login" use:enhance>
    {#if form?.message}
      <div class="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
        {form.message}
      </div>
    {/if}
    <LoginForm />
  </form>
</div>
