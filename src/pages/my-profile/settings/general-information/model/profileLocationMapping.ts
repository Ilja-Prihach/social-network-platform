import {
  isCityValue,
  isCountryValue,
  type CityValue,
  type CountryValue,
  type SelectOption,
} from './locationOptions';

export const resolveFallbackCountry = (
  countryOptions: SelectOption<CountryValue>[],
  profileCountry?: string,
): CountryValue | null => {
  if (!isCountryValue(profileCountry)) return null;
  return countryOptions.some((option) => option.value === profileCountry) ? profileCountry : null;
};

export const resolveFallbackCity = (
  cityOptions: SelectOption<CityValue>[],
  profileCity?: string,
): CityValue | null => {
  if (isCityValue(profileCity) && cityOptions.some((option) => option.value === profileCity)) {
    return profileCity;
  }

  return null;
};

export const getOptionTitleByValue = <TValue extends string>(
  options: SelectOption<TValue>[],
  value?: TValue | null,
): string => options.find((option) => option.value === value)?.title ?? '';
