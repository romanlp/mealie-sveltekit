<script lang="ts">
  import type { PageData } from './$types';
  import TaskCreateDialog from './TaskForm/task-create-dialog.svelte';
  import DataTable from './table/data-table.svelte';
  import { columns } from './table/columns.js';

  let { data }: { data: PageData } = $props();
  const tasks = data.tasks;
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold">Tasks</h1>
    <TaskCreateDialog {data} />
  </div>

  <div class="overflow-x-auto">
    <DataTable data={tasks} {columns} />
  </div>
</div>
