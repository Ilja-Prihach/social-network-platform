import { baseApi } from '@/shared/api/baseApi';

export type TranslatePostTextParams = {
  text: string;
  targetLanguage: string;
};

export type TranslatePostTextResult = {
  translatedText: string;
};

type RawTranslateResponse = {
  translatedText?: unknown;
  translation?: unknown;
  text?: unknown;
};

const normalizeResponse = (value: unknown): TranslatePostTextResult => {
  if (typeof value === 'string') {
    return { translatedText: value };
  }

  if (typeof value === 'object' && value !== null) {
    const dto = value as RawTranslateResponse;

    if (typeof dto.translatedText === 'string') {
      return { translatedText: dto.translatedText };
    }

    if (typeof dto.translation === 'string') {
      return { translatedText: dto.translation };
    }

    if (typeof dto.text === 'string') {
      return { translatedText: dto.text };
    }
  }

  throw new Error('Invalid translation response');
};

export async function translatePostText(
  params: TranslatePostTextParams,
): Promise<TranslatePostTextResult> {
  const response = await baseApi<unknown>('/api/posts/translate', {
    method: 'POST',
    body: params,
  });

  return normalizeResponse(response);
}
