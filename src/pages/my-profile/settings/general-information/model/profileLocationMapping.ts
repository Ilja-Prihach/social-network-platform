import {
  isCityValue,
  isCountryValue,
  type CountryValue,
  type SelectOption,
} from './locationOptions';

const findOptionValueByTitle = (options: SelectOption[], title?: string): string | null => {
  if (!title?.trim()) return null;
  const normalizedTitle = title.trim().toLowerCase();

  return (
    options.find((option) => option.title.trim().toLowerCase() === normalizedTitle)?.value ?? null
  );
};

export const resolveFallbackCountry = (
  countryOptions: SelectOption[],
  profileCountry?: string,
): CountryValue | null => {
  if (isCountryValue(profileCountry)) return profileCountry;
  return findOptionValueByTitle(countryOptions, profileCountry) as CountryValue | null;
};

export const resolveFallbackCity = (
  cityOptions: SelectOption[],
  profileCity?: string,
): string | null => {
  if (isCityValue(profileCity) && cityOptions.some((option) => option.value === profileCity)) {
    return profileCity;
  }

  return findOptionValueByTitle(cityOptions, profileCity);
};

export const getOptionTitleByValue = (options: SelectOption[], value?: string | null): string =>
  options.find((option) => option.value === value)?.title ?? '';
