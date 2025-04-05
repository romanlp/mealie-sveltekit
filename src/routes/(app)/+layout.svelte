<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import { page } from '$app/state';

  let { children } = $props();
</script>

<Sidebar.Provider>
  <AppSidebar user={page.data.user} />
  <main class="flex-1">
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>
