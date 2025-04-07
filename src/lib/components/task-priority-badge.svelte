<script lang="ts">
  let { priority }: { priority: string } = $props();
</script>

<span
  class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold
  {priority === 'LOW'
    ? 'bg-green-100 text-green-800'
    : priority === 'MEDIUM'
      ? 'bg-yellow-100 text-yellow-800'
      : priority === 'HIGH'
        ? 'bg-orange-100 text-orange-800'
        : 'bg-red-100 text-red-800'}"
>
  {priority}
</span>
