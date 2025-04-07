<script lang="ts">
  let { status }: { status: string } = $props();
</script>

<span
  class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold
  {status === 'TODO'
    ? 'bg-gray-100 text-gray-800'
    : status === 'IN_PROGRESS'
      ? 'bg-blue-100 text-blue-800'
      : status === 'REVIEW'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800'}"
>
  {status}
</span>
