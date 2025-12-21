# shared/lib

Shared utilities and helpers that are framework-agnostic.

## Suggested structure
- `formatters/` – text/number/date helpers.
- `validators/` – common validation rules.
- `adapters/` – cross-cutting helpers (e.g., storage, feature flags).

## Example
```ts
// formatters/formatCurrency.ts
export const formatCurrency = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
```
