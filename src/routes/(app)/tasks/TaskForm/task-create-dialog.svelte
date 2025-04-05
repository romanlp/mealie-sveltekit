<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import * as table from '@server/db/schema/schema';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
  import type { FormSchema } from './form.schema';
  import Input from '$lib/components/ui/input/input.svelte';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Popover from '$lib/components/ui/popover';
  import Calendar from '$lib/components/ui/calendar/calendar.svelte';
  import { cn } from '$lib/utils';
  import CalendarIcon from 'lucide-svelte/icons/calendar';
  import type { ButtonProps } from '$lib/components/ui/button/button.svelte';
  import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
    parseDate,
    today
  } from '@internationalized/date';

  let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();
  let open = $state(false);
  const form = superForm(data.form);
  const { form: formData, enhance } = form;

  const df = new DateFormatter('en-GB', {
    dateStyle: 'long'
  });
  let value = $state<DateValue | undefined>();
  $effect(() => {
    value = $formData.dueDate ? parseDate($formData.dueDate) : undefined;
  });

  let placeholder = $state<DateValue | undefined>();
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
          {#snippet children({ props })}
            <Form.Label>Title</Form.Label>
            <Input type="text" name={props.name} required placeholder="Enter task title" />
          {/snippet}
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
          {#snippet children({ props })}
            <Form.Label>Status</Form.Label>
            <Select.Root type="single" name={props.name} bind:value={$formData.status}>
              <Select.Trigger {...props}>{$formData.status ?? 'Select status'}</Select.Trigger>
              <Select.Content>
                {#each table.taskStatusValues as status}
                  <Select.Item value={status}>{status}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
      </Form.Field>

      <Form.Field {form} name="priority">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Priority</Form.Label>
            <Select.Root type="single" name={props.name} bind:value={$formData.priority}>
              <Select.Trigger {...props}>{$formData.priority ?? 'Select priority'}</Select.Trigger>
              <Select.Content>
                {#each table.priorityValues as priority}
                  <Select.Item value={priority}>{priority}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
      </Form.Field>

      <Form.Field {form} name="dueDate">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Due Date</Form.Label>
            <Popover.Root>
              <Popover.Trigger {...props}>
                {#snippet child({ props }: { props: ButtonProps })}
                  <Button
                    variant="outline"
                    class={cn(
                      'w-[280px] justify-start pl-4 text-left font-normal',
                      !value && 'text-muted-foreground'
                    )}
                    {...props}
                  >
                    {value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
                    <CalendarIcon class="ml-auto size-4 opacity-50" />
                  </Button>
                {/snippet}
              </Popover.Trigger>
              <Popover.Content class="w-auto p-0" side="top">
                <Calendar
                  type="single"
                  {value}
                  bind:placeholder
                  minValue={new CalendarDate(1900, 1, 1)}
                  maxValue={today(getLocalTimeZone())}
                  calendarLabel="Due date"
                  onValueChange={(v) => {
                    if (v) {
                      $formData.dueDate = v.toString();
                    } else {
                      $formData.dueDate = '';
                    }
                  }}
                />
              </Popover.Content>
            </Popover.Root>
          {/snippet}
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
