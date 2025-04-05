<script lang="ts">
  import Activity from 'lucide-svelte/icons/activity';
  import CreditCard from 'lucide-svelte/icons/credit-card';
  import DollarSign from 'lucide-svelte/icons/dollar-sign';
  import Download from 'lucide-svelte/icons/download';
  import Users from 'lucide-svelte/icons/users';
  import { Button } from '$lib/components/ui/button/index.js';
  import { CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import Card from '$lib/components/ui/card/card.svelte';
  import { Tabs } from 'bits-ui';
</script>

<div class="hidden flex-col md:flex">
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <div class="ml-auto flex items-center space-x-4"></div>
    </div>
  </div>
  <div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div class="flex items-center space-x-2">
        <Button size="sm">Download</Button>
        <Button href="/tasks" variant="secondary" size="sm">Edit</Button>
        <Button variant="destructive" size="sm">Delete</Button>
        <Button variant="outline" size="sm">Outline</Button>
        <Button variant="ghost" size="sm">Ghost</Button>
        <Button variant="link" size="sm">Link</Button>
      </div>
    </div>
    <Tabs.Root value="overview" class="space-y-4">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="analytics" disabled>Analytics</Tabs.Trigger>
        <Tabs.Trigger value="reports" disabled>Reports</Tabs.Trigger>
        <Tabs.Trigger value="notifications" disabled>Notifications</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign class="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">$45,231.89</div>
              <p class="text-muted-foreground text-xs">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">+2350</div>
              <p class="text-muted-foreground text-xs">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">+12,234</div>
              <p class="text-muted-foreground text-xs">+19% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Active Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">+573</div>
              <p class="text-muted-foreground text-xs">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card class="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card class="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</div>
