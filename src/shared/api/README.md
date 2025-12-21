# shared/api

Common API clients and endpoint wrappers shared across layers.

## Suggested structure
- `base.ts` – HTTP client instance (fetch wrapper/axios) with interceptors.
- `endpoints/` – small modules grouping related requests.
- `types/` – response/request DTOs.

## Example
```ts
// base.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
});
```

```ts
// endpoints/profile.ts
import { apiClient } from "../base";

export const fetchProfile = () => apiClient.get("/profile");
```
