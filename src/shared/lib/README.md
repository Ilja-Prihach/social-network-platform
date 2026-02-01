# shared/lib

Shared utilities and helpers that are framework-agnostic.

## Suggested structure

- `formatters/` – text/number/date helpers.
- `validators/` – common validation rules.
- `adapters/` – cross-cutting helpers (e.g., storage, feature flags).

## i18n (Intlayer) conventions

- Page-level copy: `src/pages/<page>/` includes one `<page>.content.ts` with all user-facing strings.
- Shared UI copy: `src/shared/ui/<Component>/` includes `<Component>.content.ts` when the component owns text.
- Small leaf components: keep strings in the parent content file and pass via props.
- User-generated content: do not store in dictionaries; translate on demand and cache server-side.

## Example

```ts
// formatters/formatCurrency.ts
export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
```
