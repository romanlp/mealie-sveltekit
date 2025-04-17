<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Play, Square } from 'lucide-svelte/icons';
  import { formatDuration, makeClient } from '$lib/utils';
  import { timeTracker } from '$lib/stores/time-tracker.svelte';
  import { page } from '$app/state';

  async function handleStart() {
    timeTracker.startTimer(page);
    const response = await makeClient(fetch).api['time-entry'].actives.$get();
  }

  function handleStop() {
    timeTracker.stopTimer();
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>Time Tracker</CardTitle>
  </CardHeader>
  <CardContent class="space-y-4">
    <div class="text-3xl font-bold">{formatDuration(timeTracker.elapsedTime)}</div>
    <div class="flex gap-2">
      {#if !timeTracker.isRunning}
        <Button size="sm" onclick={handleStart}>
          <Play class="mr-2 h-4 w-4" />
          Start
        </Button>
      {:else}
        <Button size="sm" variant="destructive" onclick={handleStop}>
          <Square class="mr-2 h-4 w-4" />
          Stop
        </Button>
      {/if}
    </div>
  </CardContent>
</Card>
