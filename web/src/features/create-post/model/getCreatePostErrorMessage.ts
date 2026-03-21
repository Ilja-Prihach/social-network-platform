export function getCreatePostErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== 'object' || error === null || !('data' in error)) {
    return fallback;
  }

  const data = (error as { data?: unknown }).data;

  if (typeof data === 'string' && data) {
    return data;
  }

  if (typeof data === 'object' && data !== null) {
    const record = data as {
      message?: string;
      error?: string;
      messages?: Array<string | { message?: string }>;
    };

    if (Array.isArray(record.messages) && record.messages.length > 0) {
      const first = record.messages[0];

      if (typeof first === 'string' && first) return first;
      if (typeof first === 'object' && first?.message) return first.message;
    }

    if (typeof record.message === 'string' && record.message) return record.message;
    if (typeof record.error === 'string' && record.error) return record.error;
  }

  return fallback;
}
