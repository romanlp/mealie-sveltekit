<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
</script>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Create an Account</Card.Title>
    <Card.Description>Enter your details below to create your account</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
      </div>
      <div class="grid gap-2">
        <Label for="username">Username</Label>
        <Input id="username" name="username" type="text" required />
      </div>
      <div class="grid gap-2">
        <Label for="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div class="grid gap-2">
        <Label for="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>
      <Button type="submit" class="w-full">Create Account</Button>
      <Button variant="outline" class="w-full">Sign up with Google</Button>
    </div>
    <div class="mt-4 text-center text-sm">
      Already have an account?
      <a href="/login" class="underline">Login</a>
    </div>
  </Card.Content>
</Card.Root>
