import { buildJsonResponse } from '@/shared/api/server/bffResponse';
import { bffFetch } from '@/shared/api/server/bffFetch';

export async function GET() {
  const { res } = await bffFetch('/api/v1/public-user', {
    method: 'GET',
  });

  return buildJsonResponse(res);
}
