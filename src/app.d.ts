// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Platform {
      env: Env;
      cf: CfProperties;
      ctx: ExecutionContext;
    }
    interface Locals {
      user: import('@server/auth/lucia-helpers').SessionValidationResult['user'];
      session: import('@server/auth/lucia-helpers').SessionValidationResult['session'];
    }
  }
}

export {};
