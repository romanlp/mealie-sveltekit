<script lang="ts">
  import type { PageData } from './$types';
  import type { Task } from '@server/db/schema/schema';
  import TaskCreateDialog from '$lib/components/task-create-dialog.svelte';

  export let data: PageData;
  const tasks: Task[] = data.tasks;
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold">Tasks</h1>
    <TaskCreateDialog />
  </div>

  <div class="overflow-x-auto">
    <table class="min-w-full border border-gray-200 bg-white">
      <thead>
        <tr class="bg-gray-100">
          <th
            class="border-b border-gray-200 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Title
          </th>
          <th
            class="border-b border-gray-200 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Status
          </th>
          <th
            class="border-b border-gray-200 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Priority
          </th>
          <th
            class="border-b border-gray-200 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Due Date
          </th>
          <th
            class="border-b border-gray-200 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Assignee
          </th>
        </tr>
      </thead>
      <tbody>
        {#each tasks as task}
          <tr class="hover:bg-gray-50">
            <td class="border-b border-gray-200 px-6 py-4">
              <a href="/tasks/{task.id}" class="text-blue-600 hover:text-blue-800">
                {task.title}
              </a>
            </td>
            <td class="border-b border-gray-200 px-6 py-4">
              <span
                class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold
                {task.status === 'TODO'
                  ? 'bg-gray-100 text-gray-800'
                  : task.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-800'
                    : task.status === 'REVIEW'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'}"
              >
                {task.status}
              </span>
            </td>
            <td class="border-b border-gray-200 px-6 py-4">
              <span
                class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold
                {task.priority === 'LOW'
                  ? 'bg-green-100 text-green-800'
                  : task.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : task.priority === 'HIGH'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'}"
              >
                {task.priority}
              </span>
            </td>
            <td class="border-b border-gray-200 px-6 py-4">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
            </td>
            <td class="border-b border-gray-200 px-6 py-4">
              {task.assigneeId || '-'}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
