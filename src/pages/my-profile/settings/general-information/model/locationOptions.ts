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

export type SelectOption = { value: string; title: string };

type CountryTitleKey =
  | 'countryBelarus'
  | 'countryRussia'
  | 'countryIsrael'
  | 'countryPoland'
  | 'countryGermany'
  | 'countryItaly'
  | 'countrySpain'
  | 'countryFrance'
  | 'countryNorway'
  | 'countrySweden'
  | 'countryUsa'
  | 'countryCanada';

type CityTitleKey =
  | 'cityMinsk'
  | 'cityBrest'
  | 'cityGomel'
  | 'cityGrodno'
  | 'cityVitebsk'
  | 'cityMogilev'
  | 'cityMoscow'
  | 'citySaintPetersburg'
  | 'cityNovosibirsk'
  | 'cityYekaterinburg'
  | 'cityKazan'
  | 'cityNizhnyNovgorod'
  | 'cityJerusalem'
  | 'cityTelAviv'
  | 'cityHaifa'
  | 'cityRishonLeZion'
  | 'cityPetahTikva'
  | 'cityAshdod'
  | 'cityWarsaw'
  | 'cityKrakow'
  | 'cityLodz'
  | 'cityWroclaw'
  | 'cityPoznan'
  | 'cityGdansk'
  | 'cityBerlin'
  | 'cityHamburg'
  | 'cityMunich'
  | 'cityCologne'
  | 'cityFrankfurt'
  | 'cityStuttgart'
  | 'cityRome'
  | 'cityMilan'
  | 'cityNaples'
  | 'cityTurin'
  | 'cityPalermo'
  | 'cityBologna'
  | 'cityMadrid'
  | 'cityBarcelona'
  | 'cityValencia'
  | 'citySeville'
  | 'cityZaragoza'
  | 'cityMalaga'
  | 'cityParis'
  | 'cityMarseille'
  | 'cityLyon'
  | 'cityToulouse'
  | 'cityNice'
  | 'cityNantes'
  | 'cityOslo'
  | 'cityBergen'
  | 'cityTrondheim'
  | 'cityStavanger'
  | 'cityDrammen'
  | 'cityFredrikstad'
  | 'cityStockholm'
  | 'cityGothenburg'
  | 'cityMalmo'
  | 'cityUppsala'
  | 'cityVasteras'
  | 'cityOrebro'
  | 'cityWashingtonDc'
  | 'cityNewYork'
  | 'cityLosAngeles'
  | 'cityChicago'
  | 'cityHouston'
  | 'cityPhoenix'
  | 'cityOttawa'
  | 'cityToronto'
  | 'cityMontreal'
  | 'cityVancouver'
  | 'cityCalgary'
  | 'cityEdmonton';

const countryDefs: ReadonlyArray<{ value: CountryValue; titleKey: CountryTitleKey }> = [
  { value: 'belarus', titleKey: 'countryBelarus' },
  { value: 'russia', titleKey: 'countryRussia' },
  { value: 'israel', titleKey: 'countryIsrael' },
  { value: 'poland', titleKey: 'countryPoland' },
  { value: 'germany', titleKey: 'countryGermany' },
  { value: 'italy', titleKey: 'countryItaly' },
  { value: 'spain', titleKey: 'countrySpain' },
  { value: 'france', titleKey: 'countryFrance' },
  { value: 'norway', titleKey: 'countryNorway' },
  { value: 'sweden', titleKey: 'countrySweden' },
  { value: 'usa', titleKey: 'countryUsa' },
  { value: 'canada', titleKey: 'countryCanada' },
];

const cityDefsByCountry: Readonly<
  Record<CountryValue, ReadonlyArray<{ value: string; titleKey: CityTitleKey }>>
> = {
  belarus: [
    { value: 'minsk', titleKey: 'cityMinsk' },
    { value: 'brest', titleKey: 'cityBrest' },
    { value: 'gomel', titleKey: 'cityGomel' },
    { value: 'grodno', titleKey: 'cityGrodno' },
    { value: 'vitebsk', titleKey: 'cityVitebsk' },
    { value: 'mogilev', titleKey: 'cityMogilev' },
  ],
  russia: [
    { value: 'moscow', titleKey: 'cityMoscow' },
    { value: 'saint-petersburg', titleKey: 'citySaintPetersburg' },
    { value: 'novosibirsk', titleKey: 'cityNovosibirsk' },
    { value: 'yekaterinburg', titleKey: 'cityYekaterinburg' },
    { value: 'kazan', titleKey: 'cityKazan' },
    { value: 'nizhny-novgorod', titleKey: 'cityNizhnyNovgorod' },
  ],
  israel: [
    { value: 'jerusalem', titleKey: 'cityJerusalem' },
    { value: 'tel-aviv', titleKey: 'cityTelAviv' },
    { value: 'haifa', titleKey: 'cityHaifa' },
    { value: 'rishon-lezion', titleKey: 'cityRishonLeZion' },
    { value: 'petah-tikva', titleKey: 'cityPetahTikva' },
    { value: 'ashdod', titleKey: 'cityAshdod' },
  ],
  poland: [
    { value: 'warsaw', titleKey: 'cityWarsaw' },
    { value: 'krakow', titleKey: 'cityKrakow' },
    { value: 'lodz', titleKey: 'cityLodz' },
    { value: 'wroclaw', titleKey: 'cityWroclaw' },
    { value: 'poznan', titleKey: 'cityPoznan' },
    { value: 'gdansk', titleKey: 'cityGdansk' },
  ],
  germany: [
    { value: 'berlin', titleKey: 'cityBerlin' },
    { value: 'hamburg', titleKey: 'cityHamburg' },
    { value: 'munich', titleKey: 'cityMunich' },
    { value: 'cologne', titleKey: 'cityCologne' },
    { value: 'frankfurt', titleKey: 'cityFrankfurt' },
    { value: 'stuttgart', titleKey: 'cityStuttgart' },
  ],
  italy: [
    { value: 'rome', titleKey: 'cityRome' },
    { value: 'milan', titleKey: 'cityMilan' },
    { value: 'naples', titleKey: 'cityNaples' },
    { value: 'turin', titleKey: 'cityTurin' },
    { value: 'palermo', titleKey: 'cityPalermo' },
    { value: 'bologna', titleKey: 'cityBologna' },
  ],
  spain: [
    { value: 'madrid', titleKey: 'cityMadrid' },
    { value: 'barcelona', titleKey: 'cityBarcelona' },
    { value: 'valencia', titleKey: 'cityValencia' },
    { value: 'seville', titleKey: 'citySeville' },
    { value: 'zaragoza', titleKey: 'cityZaragoza' },
    { value: 'malaga', titleKey: 'cityMalaga' },
  ],
  france: [
    { value: 'paris', titleKey: 'cityParis' },
    { value: 'marseille', titleKey: 'cityMarseille' },
    { value: 'lyon', titleKey: 'cityLyon' },
    { value: 'toulouse', titleKey: 'cityToulouse' },
    { value: 'nice', titleKey: 'cityNice' },
    { value: 'nantes', titleKey: 'cityNantes' },
  ],
  norway: [
    { value: 'oslo', titleKey: 'cityOslo' },
    { value: 'bergen', titleKey: 'cityBergen' },
    { value: 'trondheim', titleKey: 'cityTrondheim' },
    { value: 'stavanger', titleKey: 'cityStavanger' },
    { value: 'drammen', titleKey: 'cityDrammen' },
    { value: 'fredrikstad', titleKey: 'cityFredrikstad' },
  ],
  sweden: [
    { value: 'stockholm', titleKey: 'cityStockholm' },
    { value: 'gothenburg', titleKey: 'cityGothenburg' },
    { value: 'malmo', titleKey: 'cityMalmo' },
    { value: 'uppsala', titleKey: 'cityUppsala' },
    { value: 'vasteras', titleKey: 'cityVasteras' },
    { value: 'orebro', titleKey: 'cityOrebro' },
  ],
  usa: [
    { value: 'washington-dc', titleKey: 'cityWashingtonDc' },
    { value: 'new-york', titleKey: 'cityNewYork' },
    { value: 'los-angeles', titleKey: 'cityLosAngeles' },
    { value: 'chicago', titleKey: 'cityChicago' },
    { value: 'houston', titleKey: 'cityHouston' },
    { value: 'phoenix', titleKey: 'cityPhoenix' },
  ],
  canada: [
    { value: 'ottawa', titleKey: 'cityOttawa' },
    { value: 'toronto', titleKey: 'cityToronto' },
    { value: 'montreal', titleKey: 'cityMontreal' },
    { value: 'vancouver', titleKey: 'cityVancouver' },
    { value: 'calgary', titleKey: 'cityCalgary' },
    { value: 'edmonton', titleKey: 'cityEdmonton' },
  ],
};

export function buildCountryOptions(getLabel: (key: CountryTitleKey) => string): SelectOption[] {
  return countryDefs.map((country) => ({
    value: country.value,
    title: getLabel(country.titleKey),
  }));
}

export function buildCityOptionsByCountry(
  getLabel: (key: CityTitleKey) => string,
): Record<CountryValue, SelectOption[]> {
  return Object.fromEntries(
    Object.entries(cityDefsByCountry).map(([country, cities]) => [
      country,
      cities.map((city) => ({
        value: city.value,
        title: getLabel(city.titleKey),
      })),
    ]),
  ) as Record<CountryValue, SelectOption[]>;
}
