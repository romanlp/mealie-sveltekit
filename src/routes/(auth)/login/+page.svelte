<script lang="ts">
  import { enhance } from '$app/forms';
  import LoginForm from '$lib/components/login-form.svelte';
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <form method="post" action="?/login" use:enhance>
    <LoginForm />
  </form>
</div>
