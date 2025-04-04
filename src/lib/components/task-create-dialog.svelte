<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import * as table from '@server/db/schema/schema';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  let open = false;

  async function handleSubmit(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const response = await fetch('/api/task', {
      method: 'POST',
      body: JSON.stringify({
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        priority: formData.get('priority'),
        dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null,
        estimatedHours: formData.get('estimatedHours')
          ? Number(formData.get('estimatedHours'))
          : null
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      open = false;
      goto('/tasks', { invalidateAll: true });
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    <button class="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
      Create Task
    </button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create New Task</Dialog.Title>
      <Dialog.Description>Fill in the details to create a new task.</Dialog.Description>
    </Dialog.Header>
    Hello!
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <Form.Field>
        <Form.Label>Title</Form.Label>
        <Form.Control>
          <input
            type="text"
            name="title"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter task title"
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <!-- <Form.Field>
        <Form.Label>Description</Form.Label>
        <Form.Control>
          <textarea
            name="description"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter task description"
          />
        </Form.Control>
      </Form.Field>

      <Form.Field>
        <Form.Label>Status</Form.Label>
        <Form.Control>
          <select name="status" class="w-full rounded-md border border-gray-300 px-3 py-2">
            {#each table.taskStatusValues as status}
              <option value={status}>{status}</option>
            {/each}
          </select>
        </Form.Control>
      </Form.Field>

      <Form.Field>
        <Form.Label>Priority</Form.Label>
        <Form.Control>
          <select name="priority" class="w-full rounded-md border border-gray-300 px-3 py-2">
            {#each table.priorityValues as priority}
              <option value={priority}>{priority}</option>
            {/each}
          </select>
        </Form.Control>
      </Form.Field>

      <Form.Field>
        <Form.Label>Due Date</Form.Label>
        <Form.Control>
          <input
            type="date"
            name="dueDate"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </Form.Control>
      </Form.Field>

      <Form.Field>
        <Form.Label>Estimated Hours</Form.Label>
        <Form.Control>
          <input
            type="number"
            name="estimatedHours"
            min="0"
            step="0.5"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter estimated hours"
          />
        </Form.Control>
      </Form.Field>

      <div class="flex justify-end gap-2">
        <Dialog.Close>
          <button type="button" class="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
        </Dialog.Close>
        <button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Create Task
        </button>
      </div>-->
    </form>
  </Dialog.Content>
</Dialog.Root>
