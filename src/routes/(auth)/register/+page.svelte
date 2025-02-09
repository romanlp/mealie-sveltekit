<script lang="ts">
  import { enhance } from '$app/forms';
  import RegisterForm from '$lib/components/register-form.svelte';
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <form method="post" action="?/register" use:enhance>
    <RegisterForm />
  </form>
</div>
