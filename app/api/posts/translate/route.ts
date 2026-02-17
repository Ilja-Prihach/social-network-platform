import { NextResponse } from 'next/server';
import { AIProvider, generateText, getAIConfig } from '@intlayer/ai';

const BAD_REQUEST_MESSAGE = 'text and targetLanguage are required';
const TRANSLATION_ERROR_MESSAGE = 'Translation provider is unavailable';
const LOCALE_TO_GOOGLE_LANG: Record<string, string> = {
  en: 'en',
  fr: 'fr',
  es: 'es',
  ru: 'ru',
  it: 'it',
  he: 'he',
};

type TranslateBody = {
  text?: unknown;
  targetLanguage?: unknown;
};

const LOCALE_TO_LANGUAGE_NAME: Record<string, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  ru: 'Russian',
  it: 'Italian',
  he: 'Hebrew',
};

const isValidTranslateBody = (
  body: TranslateBody,
): body is { text: string; targetLanguage: string } => {
  return (
    typeof body.text === 'string' &&
    body.text.trim().length > 0 &&
    typeof body.targetLanguage === 'string' &&
    body.targetLanguage.trim().length > 0
  );
};

const extractTranslatedText = (value: string): string | null => {
  const text = value.trim();
  return text.length ? text : null;
};

export async function POST(request: Request) {
  let body: TranslateBody;

  try {
    body = (await request.json()) as TranslateBody;
  } catch {
    return NextResponse.json({ message: BAD_REQUEST_MESSAGE }, { status: 400 });
  }

  if (!isValidTranslateBody(body)) {
    return NextResponse.json({ message: BAD_REQUEST_MESSAGE }, { status: 400 });
  }

  const text = body.text.trim();
  const targetLanguage = body.targetLanguage.trim().toLowerCase();
  const outputLanguage = LOCALE_TO_LANGUAGE_NAME[targetLanguage];
  const googleLanguageCode = LOCALE_TO_GOOGLE_LANG[targetLanguage];

  if (!outputLanguage || !googleLanguageCode) {
    return NextResponse.json({ message: BAD_REQUEST_MESSAGE }, { status: 400 });
  }

  try {
    const aiConfig = await getAIConfig({
      defaultOptions: {
        provider: AIProvider.OPENAI,
        model: 'gpt-5-mini',
      },
      accessType: ['public'],
    });

    const { text: translatedRaw } = await generateText({
      ...aiConfig,
      prompt: [
        `Translate the following post text to ${outputLanguage}.`,
        'Return only translated text, without comments, quotes, or explanation.',
        '',
        text,
      ].join('\n'),
    });

    const translatedText = extractTranslatedText(translatedRaw);
    if (!translatedText) {
      return NextResponse.json({ message: TRANSLATION_ERROR_MESSAGE }, { status: 502 });
    }

    return NextResponse.json({ translatedText });
  } catch {
    const fallbackText = await translateWithGoogle(text, googleLanguageCode);
    if (!fallbackText) {
      return NextResponse.json({ message: TRANSLATION_ERROR_MESSAGE }, { status: 502 });
    }

    return NextResponse.json({ translatedText: fallbackText });
  }
}

const translateWithGoogle = async (
  text: string,
  targetLanguage: string,
): Promise<string | null> => {
  const query = new URLSearchParams({
    client: 'gtx',
    sl: 'auto',
    tl: targetLanguage,
    dt: 't',
    q: text,
  });

  const providerResponse = await fetch(
    `https://translate.googleapis.com/translate_a/single?${query.toString()}`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  );

  if (!providerResponse.ok) {
    return null;
  }

  let payload: unknown;
  try {
    payload = await providerResponse.json();
  } catch {
    return null;
  }

  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    return null;
  }

  const translated = payload[0]
    .map((chunk) => (Array.isArray(chunk) && typeof chunk[0] === 'string' ? chunk[0] : ''))
    .join('')
    .trim();

  return translated || null;
};
