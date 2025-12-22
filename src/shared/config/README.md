# shared/config

Centralized runtime configuration and constants shared across the app.

## Suggested structure
- `env.ts` – safe accessors for environment variables.
- `featureFlags.ts` – toggles for experimental features.
- `constants.ts` – reusable values (routes, limits, etc.).

## Example
```ts
// env.ts
const required = (value: string | undefined, key: string) => {
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
};

export const apiUrl = required(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL");
```
