import TaskPriorityBadge from '$lib/components/task-priority-badge.svelte';
import TaskStatusBadge from '$lib/components/task-status-badge.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import type { Task } from '@server/db/schema/schema';
import type { ColumnDef } from '@tanstack/table-core';

export const columns: ColumnDef<Task, unknown>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    accessorFn: (row) => row.title
  },
  {
    accessorKey: 'status',
    header: 'Status',
    accessorFn: (row) => row.status,
    cell: ({ row }) => {
      const status = row.original.status;
      return renderComponent(TaskStatusBadge, { status });
    }
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    accessorFn: (row) => row.priority,
    cell: ({ row }) => {
      const priority = row.original.priority;
      return renderComponent(TaskPriorityBadge, { priority });
    }
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    accessorFn: (row) => row.dueDate
  },
  {
    accessorKey: 'assigneeId',
    header: 'Assignee',
    accessorFn: (row) => row.assigneeId
  }
];
