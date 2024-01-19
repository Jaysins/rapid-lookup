export interface ICountry {
  name: string;
  code: string;
  continent: string;
  currencies?: { name: string; alphaCode: string; symbol: string }[] | null;
  capital?: string | null;
  subRegion?: string | null;
  languages?: { code: string; name: string }[] | null;
  flag?: string | null;
  population?: number | null;
  mapUrl?: string | null;
  timezones?: string[] | null;
  createdAt?: Date;
  updatedAt?: Date;
  lastQueried?: Date;
}

export interface IGeographyResponseData {
  href: string;
  name: {
    common: string;
    official: string;
    nativeName: { lang: string; official: string; common: string }[];
    translations: { lang: string; official: string; common: string }[];
  };
  tld: string[];
  cca2: string;
  currencies: { name: string; alphaCode: string; symbol: string }[];
  capital: { name: string; latLng: { lat: number; lng: number } }[];
  subregion: string;
  languages: { code: string; name: string }[];
  flags: { png: string; svg: string; alt: string };
  population: number;
  maps: { googleMaps: string; openStreetMaps: string };
  car: { signs: string[]; side: string };
  timezones: string[];
}
