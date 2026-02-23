import { useEffect, useState } from 'react';

type NominatimResult = {
  place_id: number;
  name?: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    suburb?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

export type LocationSuggestion = {
  id: string;
  city: string;
  description: string;
};

type UseLocationSuggestionsArgs = {
  enabled: boolean;
  query: string;
};

export function useLocationSuggestions({ enabled, query }: UseLocationSuggestionsArgs): {
  suggestions: LocationSuggestion[];
  isLoading: boolean;
} {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!enabled || normalizedQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          q: normalizedQuery,
          format: 'jsonv2',
          addressdetails: '1',
          limit: '10',
          'accept-language': 'en',
        });

        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Location search failed: ${response.status}`);
        }

        const data = (await response.json()) as NominatimResult[];
        const mapped = data.map((item) => {
          const city =
            item.address?.city ||
            item.address?.town ||
            item.address?.village ||
            item.address?.hamlet ||
            item.name ||
            item.display_name.split(',')[0] ||
            'Unknown';

          const descriptionParts = [
            item.address?.suburb,
            item.address?.county,
            item.address?.state,
            item.address?.country,
          ].filter(Boolean);

          return {
            id: String(item.place_id),
            city,
            description: descriptionParts.join(', ') || item.display_name,
          };
        });

        setSuggestions(mapped);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [enabled, query]);

  return {
    suggestions,
    isLoading,
  };
}
