<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Play, Square } from 'lucide-svelte/icons';
  import { formatDuration } from '$lib/utils';
  import { timeTracker } from '$lib/stores/time-tracker.svelte';
  import { page } from '$app/state';

  function handleStart() {
    timeTracker.startTimer(page);
  }

  function handleStop() {
    timeTracker.stopTimer();
  }

  // Local reference to prevent TypeScript errors
  const isInitialized = 'isInitialized' in timeTracker ? timeTracker.isInitialized : true;
</script>

<div class="flex flex-col gap-2 p-2">
  <div class="text-md font-medium">{formatDuration(timeTracker.elapsedTime)}</div>
  <div class="flex gap-1">
    {#if !timeTracker.isRunning}
      <Button
        size="sm"
        variant="ghost"
        class="h-8 w-8 p-0"
        onclick={handleStart}
        disabled={!isInitialized}
      >
        <Play class="h-4 w-4" />
        <span class="sr-only">Start Timer</span>
      </Button>
    {:else}
      <Button size="sm" variant="ghost" class="text-destructive h-8 w-8 p-0" onclick={handleStop}>
        <Square class="h-4 w-4" />
        <span class="sr-only">Stop Timer</span>
      </Button>
    {/if}
  </div>
</div>
