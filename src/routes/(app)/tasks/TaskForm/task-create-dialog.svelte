<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import * as table from '@server/db/schema/schema';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
  import { goto } from '$app/navigation';
  import type { FormSchema } from './form.schema';
  import { enhance } from '$app/forms';
  import Input from '$lib/components/ui/input/input.svelte';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import SelectContent from '$lib/components/ui/select/select-content.svelte';
  import SelectItem from '$lib/components/ui/select/select-item.svelte';
  import SelectTrigger from '$lib/components/ui/select/select-trigger.svelte';
  import Button from '$lib/components/ui/button/button.svelte';

  let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();
  let open = $state(false);
  const form = superForm(data.form);

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
    <Button>Create Task</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create New Task</Dialog.Title>
      <Dialog.Description>Fill in the details to create a new task.</Dialog.Description>
    </Dialog.Header>
    <form method="POST" use:enhance class="space-y-4">
      <Form.Field {form} name="title">
        <Form.Control>
          <Form.Label>Title</Form.Label>
          <Input type="text" name="title" required placeholder="Enter task title" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="description">
        <Form.Control>
          <Form.Label>Description</Form.Label>
          <Textarea name="description" placeholder="Enter task description" />
        </Form.Control>
      </Form.Field>

      <Form.Field {form} name="status">
        <Form.Control>
          <Form.Label>Status</Form.Label>
          <Select.Root type="single" name="status">
            <Select.Trigger>Select status</Select.Trigger>
            <SelectContent>
              {#each table.taskStatusValues as status}
                <SelectItem value={status}>{status}</SelectItem>
              {/each}
            </SelectContent>
          </Select.Root>
        </Form.Control>
      </Form.Field>

      <Form.Field {form} name="priority">
        <Form.Control>
          <Form.Label>Priority</Form.Label>
          <Select.Root type="single" name="priority">
            <Select.Trigger>Select priority</Select.Trigger>
            <Select.Content>
              {#each table.priorityValues as priority}
                <Select.Item value={priority}>{priority}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </Form.Control>
      </Form.Field>

      <Form.Field {form} name="dueDate">
        <Form.Control>
          <Form.Label>Due Date</Form.Label>
          <Input type="date" name="dueDate" />
        </Form.Control>
      </Form.Field>

      <Form.Field {form} name="estimatedHours">
        <Form.Control>
          <Form.Label>Estimated Hours</Form.Label>
          <Input
            type="number"
            name="estimatedHours"
            min="0"
            step="0.5"
            placeholder="Enter estimated hours"
          />
        </Form.Control>
      </Form.Field>

      <div class="flex justify-end gap-2">
        <Dialog.Close>
          <Button variant="outline">Cancel</Button>
        </Dialog.Close>
        <Form.Button>Create Task</Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
