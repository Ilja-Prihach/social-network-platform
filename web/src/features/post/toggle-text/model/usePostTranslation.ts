'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intlayer';
import { translatePostText } from '@/entities/post';
import { isApiError } from '@/shared/api/types';

const SUPPORTED_LOCALES = new Set(['en', 'fr', 'es', 'ru', 'it', 'he']);
const LATIN_LETTER_REGEX = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
const CYRILLIC_REGEX = /[\u0400-\u04FF]/;
const HEBREW_REGEX = /[\u0590-\u05FF]/;
const FR_MARKERS = [' le ', ' la ', ' les ', ' des ', ' un ', ' une ', ' et ', ' que '];
const ES_MARKERS = [' el ', ' la ', ' los ', ' las ', ' de ', ' que ', ' y ', ' para '];
const IT_MARKERS = [' il ', ' lo ', ' la ', ' gli ', ' le ', ' di ', ' che ', ' per '];
const EN_MARKERS = [' the ', ' and ', ' for ', ' with ', ' this ', ' that ', ' you ', ' are '];

const normalize = (value: string): string => value.trim().replace(/\s+/g, ' ').toLowerCase();
const isDifferentText = (left: string, right: string): boolean =>
  normalize(left) !== normalize(right);
const normalizeLocale = (value: string): string => value.split('-')[0]?.toLowerCase() ?? 'en';

const countMarkers = (text: string, markers: string[]): number =>
  markers.reduce((acc, marker) => acc + (text.includes(marker) ? 1 : 0), 0);

const detectPostLanguage = (text: string): string | null => {
  const normalized = ` ${normalize(text)} `;
  if (!normalized.trim()) return null;

  if (HEBREW_REGEX.test(normalized)) return 'he';
  if (CYRILLIC_REGEX.test(normalized)) return 'ru';
  if (!LATIN_LETTER_REGEX.test(normalized)) return null;

  const frScore = countMarkers(normalized, FR_MARKERS);
  const esScore = countMarkers(normalized, ES_MARKERS);
  const itScore = countMarkers(normalized, IT_MARKERS);
  const enScore = countMarkers(normalized, EN_MARKERS);

  const scored = [
    ['fr', frScore],
    ['es', esScore],
    ['it', itScore],
    ['en', enScore],
  ] as const;
  const [lang, score] = scored.reduce((best, item) => (item[1] > best[1] ? item : best), ['en', 0]);

  return score > 0 ? lang : null;
};

export function usePostTranslation(text: string) {
  const queryClient = useQueryClient();
  const { locale } = useLocale();
  const targetLanguage = normalizeLocale(locale ?? 'en');
  const normalizedText = text.trim();
  const sourceLanguage = useMemo(() => detectPostLanguage(normalizedText), [normalizedText]);
  const canTranslate =
    normalizedText.length > 0 &&
    SUPPORTED_LOCALES.has(targetLanguage) &&
    sourceLanguage !== targetLanguage;
  const contextKey = `${targetLanguage}:${normalizedText}`;
  const [shownContextKey, setShownContextKey] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<'not_found' | 'failed' | null>(null);
  const isTranslationShown = shownContextKey === contextKey;
  const queryKey = useMemo(
    () => ['post-translation', normalizedText, targetLanguage],
    [normalizedText, targetLanguage],
  );

  const mutation = useMutation({
    mutationFn: () =>
      translatePostText({
        text: normalizedText,
        targetLanguage,
      }),
    retry: false,
  });
  const { isPending } = mutation;

  const cached = queryClient.getQueryData<{ translatedText: string }>(queryKey);
  const translated = (cached?.translatedText ?? '').trim();
  const hasTranslation =
    canTranslate && translated.length > 0 && isDifferentText(translated, normalizedText);

  const requestTranslation = async () => {
    if (!canTranslate) return;
    const cachedText = cached?.translatedText?.trim() ?? '';
    if (cachedText && isDifferentText(cachedText, normalizedText)) {
      setErrorCode(null);
      setShownContextKey(contextKey);
      return;
    }

    if (!cachedText) {
      try {
        const result = await mutation.mutateAsync();
        queryClient.setQueryData(queryKey, result);
        const nextText = result.translatedText.trim();
        if (nextText && isDifferentText(nextText, normalizedText)) {
          setErrorCode(null);
          setShownContextKey(contextKey);
        }
      } catch (error) {
        if (isApiError(error) && error.status === 404) {
          setErrorCode('not_found');
          return;
        }

        setErrorCode('failed');
      }
      return;
    }
  };

  const toggleTranslation = async () => {
    if (isTranslationShown) {
      setShownContextKey(null);
      return;
    }

    setErrorCode(null);
    await requestTranslation();
  };

  return {
    text: isTranslationShown && hasTranslation ? translated : text,
    isTranslating: isPending,
    hasTranslation,
    isTranslationShown,
    toggleTranslation,
    canTranslate,
    errorCode,
  };
}
