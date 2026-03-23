import {
  isCityValue,
  isCountryValue,
  type CityValue,
  type CountryValue,
  type SelectOption,
} from './locationOptions';

const findOptionValueByTitle = <TValue extends string>(
  options: SelectOption<TValue>[],
  title?: string,
): TValue | null => {
  if (!title?.trim()) return null;
  const normalizedTitle = title.trim().toLowerCase();

  return (
    options.find((option) => option.title.trim().toLowerCase() === normalizedTitle)?.value ?? null
  );
};

export const resolveFallbackCountry = (
  countryOptions: SelectOption<CountryValue>[],
  profileCountry?: string,
): CountryValue | null => {
  if (isCountryValue(profileCountry)) {
    return countryOptions.some((option) => option.value === profileCountry) ? profileCountry : null;
  }

  return findOptionValueByTitle(countryOptions, profileCountry);
};

export const resolveFallbackCity = (
  cityOptions: SelectOption<CityValue>[],
  profileCity?: string,
): CityValue | null => {
  if (isCityValue(profileCity) && cityOptions.some((option) => option.value === profileCity)) {
    return profileCity;
  }

  return findOptionValueByTitle(cityOptions, profileCity);
};

export const getOptionTitleByValue = <TValue extends string>(
  options: SelectOption<TValue>[],
  value?: TValue | null,
): string => options.find((option) => option.value === value)?.title ?? '';
