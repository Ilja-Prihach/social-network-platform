export type CountryValue =
  | 'belarus'
  | 'russia'
  | 'israel'
  | 'poland'
  | 'germany'
  | 'italy'
  | 'spain'
  | 'france'
  | 'norway'
  | 'sweden'
  | 'usa'
  | 'canada';

export type CityValue =
  | 'minsk'
  | 'brest'
  | 'gomel'
  | 'grodno'
  | 'vitebsk'
  | 'mogilev'
  | 'moscow'
  | 'saint-petersburg'
  | 'novosibirsk'
  | 'yekaterinburg'
  | 'kazan'
  | 'nizhny-novgorod'
  | 'jerusalem'
  | 'tel-aviv'
  | 'haifa'
  | 'rishon-lezion'
  | 'petah-tikva'
  | 'ashdod'
  | 'warsaw'
  | 'krakow'
  | 'lodz'
  | 'wroclaw'
  | 'poznan'
  | 'gdansk'
  | 'berlin'
  | 'hamburg'
  | 'munich'
  | 'cologne'
  | 'frankfurt'
  | 'stuttgart'
  | 'rome'
  | 'milan'
  | 'naples'
  | 'turin'
  | 'palermo'
  | 'bologna'
  | 'madrid'
  | 'barcelona'
  | 'valencia'
  | 'seville'
  | 'zaragoza'
  | 'malaga'
  | 'paris'
  | 'marseille'
  | 'lyon'
  | 'toulouse'
  | 'nice'
  | 'nantes'
  | 'oslo'
  | 'bergen'
  | 'trondheim'
  | 'stavanger'
  | 'drammen'
  | 'fredrikstad'
  | 'stockholm'
  | 'gothenburg'
  | 'malmo'
  | 'uppsala'
  | 'vasteras'
  | 'orebro'
  | 'washington-dc'
  | 'new-york'
  | 'los-angeles'
  | 'chicago'
  | 'houston'
  | 'phoenix'
  | 'ottawa'
  | 'toronto'
  | 'montreal'
  | 'vancouver'
  | 'calgary'
  | 'edmonton';

export type SelectOption = { value: string; title: string };
export type DictionaryText = string | { value: string };

const countryOrder: ReadonlyArray<CountryValue> = [
  'belarus',
  'russia',
  'israel',
  'poland',
  'germany',
  'italy',
  'spain',
  'france',
  'norway',
  'sweden',
  'usa',
  'canada',
];

const cityOrderByCountry: Readonly<Record<CountryValue, ReadonlyArray<CityValue>>> = {
  belarus: ['minsk', 'brest', 'gomel', 'grodno', 'vitebsk', 'mogilev'],
  russia: [
    'moscow',
    'saint-petersburg',
    'novosibirsk',
    'yekaterinburg',
    'kazan',
    'nizhny-novgorod',
  ],
  israel: ['jerusalem', 'tel-aviv', 'haifa', 'rishon-lezion', 'petah-tikva', 'ashdod'],
  poland: ['warsaw', 'krakow', 'lodz', 'wroclaw', 'poznan', 'gdansk'],
  germany: ['berlin', 'hamburg', 'munich', 'cologne', 'frankfurt', 'stuttgart'],
  italy: ['rome', 'milan', 'naples', 'turin', 'palermo', 'bologna'],
  spain: ['madrid', 'barcelona', 'valencia', 'seville', 'zaragoza', 'malaga'],
  france: ['paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes'],
  norway: ['oslo', 'bergen', 'trondheim', 'stavanger', 'drammen', 'fredrikstad'],
  sweden: ['stockholm', 'gothenburg', 'malmo', 'uppsala', 'vasteras', 'orebro'],
  usa: ['washington-dc', 'new-york', 'los-angeles', 'chicago', 'houston', 'phoenix'],
  canada: ['ottawa', 'toronto', 'montreal', 'vancouver', 'calgary', 'edmonton'],
};

const countryContentKeys = {
  belarus: 'countryBelarus',
  russia: 'countryRussia',
  israel: 'countryIsrael',
  poland: 'countryPoland',
  germany: 'countryGermany',
  italy: 'countryItaly',
  spain: 'countrySpain',
  france: 'countryFrance',
  norway: 'countryNorway',
  sweden: 'countrySweden',
  usa: 'countryUsa',
  canada: 'countryCanada',
} as const satisfies Record<CountryValue, string>;

const cityContentKeys = {
  minsk: 'cityMinsk',
  brest: 'cityBrest',
  gomel: 'cityGomel',
  grodno: 'cityGrodno',
  vitebsk: 'cityVitebsk',
  mogilev: 'cityMogilev',
  moscow: 'cityMoscow',
  'saint-petersburg': 'citySaintPetersburg',
  novosibirsk: 'cityNovosibirsk',
  yekaterinburg: 'cityYekaterinburg',
  kazan: 'cityKazan',
  'nizhny-novgorod': 'cityNizhnyNovgorod',
  jerusalem: 'cityJerusalem',
  'tel-aviv': 'cityTelAviv',
  haifa: 'cityHaifa',
  'rishon-lezion': 'cityRishonLeZion',
  'petah-tikva': 'cityPetahTikva',
  ashdod: 'cityAshdod',
  warsaw: 'cityWarsaw',
  krakow: 'cityKrakow',
  lodz: 'cityLodz',
  wroclaw: 'cityWroclaw',
  poznan: 'cityPoznan',
  gdansk: 'cityGdansk',
  berlin: 'cityBerlin',
  hamburg: 'cityHamburg',
  munich: 'cityMunich',
  cologne: 'cityCologne',
  frankfurt: 'cityFrankfurt',
  stuttgart: 'cityStuttgart',
  rome: 'cityRome',
  milan: 'cityMilan',
  naples: 'cityNaples',
  turin: 'cityTurin',
  palermo: 'cityPalermo',
  bologna: 'cityBologna',
  madrid: 'cityMadrid',
  barcelona: 'cityBarcelona',
  valencia: 'cityValencia',
  seville: 'citySeville',
  zaragoza: 'cityZaragoza',
  malaga: 'cityMalaga',
  paris: 'cityParis',
  marseille: 'cityMarseille',
  lyon: 'cityLyon',
  toulouse: 'cityToulouse',
  nice: 'cityNice',
  nantes: 'cityNantes',
  oslo: 'cityOslo',
  bergen: 'cityBergen',
  trondheim: 'cityTrondheim',
  stavanger: 'cityStavanger',
  drammen: 'cityDrammen',
  fredrikstad: 'cityFredrikstad',
  stockholm: 'cityStockholm',
  gothenburg: 'cityGothenburg',
  malmo: 'cityMalmo',
  uppsala: 'cityUppsala',
  vasteras: 'cityVasteras',
  orebro: 'cityOrebro',
  'washington-dc': 'cityWashingtonDc',
  'new-york': 'cityNewYork',
  'los-angeles': 'cityLosAngeles',
  chicago: 'cityChicago',
  houston: 'cityHouston',
  phoenix: 'cityPhoenix',
  ottawa: 'cityOttawa',
  toronto: 'cityToronto',
  montreal: 'cityMontreal',
  vancouver: 'cityVancouver',
  calgary: 'cityCalgary',
  edmonton: 'cityEdmonton',
} as const satisfies Record<CityValue, string>;

const toText = (value: DictionaryText): string => (typeof value === 'string' ? value : value.value);
const getRequiredText = (content: Record<string, DictionaryText>, key: string): string => {
  const value = content[key];
  if (value === undefined) {
    throw new Error(`Missing location dictionary key: ${key}`);
  }

  return toText(value);
};

export function buildCountryOptions(countryLabels: Record<CountryValue, string>): SelectOption[] {
  return countryOrder.map((country) => ({
    value: country,
    title: countryLabels[country],
  }));
}

export function buildCityOptionsByCountry(
  cityLabels: Record<CityValue, string>,
): Record<CountryValue, SelectOption[]> {
  return Object.fromEntries(
    Object.entries(cityOrderByCountry).map(([country, cities]) => [
      country,
      cities.map((city) => ({
        value: city,
        title: cityLabels[city],
      })),
    ]),
  ) as Record<CountryValue, SelectOption[]>;
}

export function buildLocationOptions(content: Record<string, DictionaryText>): {
  countryOptions: SelectOption[];
  cityOptionsByCountry: Record<CountryValue, SelectOption[]>;
} {
  const countryLabels = Object.fromEntries(
    countryOrder.map((country) => [country, getRequiredText(content, countryContentKeys[country])]),
  ) as Record<CountryValue, string>;

  const cityLabels = Object.fromEntries(
    (Object.keys(cityContentKeys) as CityValue[]).map((city) => [
      city,
      getRequiredText(content, cityContentKeys[city]),
    ]),
  ) as Record<CityValue, string>;

  return {
    countryOptions: buildCountryOptions(countryLabels),
    cityOptionsByCountry: buildCityOptionsByCountry(cityLabels),
  };
}

const countryValueSet = new Set<CountryValue>(countryOrder);
const cityValueSet = new Set<CityValue>(Object.keys(cityContentKeys) as CityValue[]);

export const isCountryValue = (value?: string | null): value is CountryValue =>
  Boolean(value && countryValueSet.has(value as CountryValue));

export const isCityValue = (value?: string | null): value is CityValue =>
  Boolean(value && cityValueSet.has(value as CityValue));
