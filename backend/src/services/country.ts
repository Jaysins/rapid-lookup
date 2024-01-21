import axios from 'axios';
import CountryModel, { ICountryModel } from '../models/country';
import { ICountry, IGeographyResponseData } from '../types/country';
import { config } from '../config';
import { BadRequestError } from '../errors';

export const loadCountries = async (continent: string): Promise<Record<string, any>> => {
  console.log('loading content');
  const options = {
    method: 'GET',
    url: `${config.integration.rapid_api_geo_url}${continent}`,
    params: {
      sortBy: 'name',
      sortOrder: 'asc',
    },
    headers: {
      'X-RapidAPI-Key': config.integration.rapid_api_key,
      'X-RapidAPI-Host': config.integration.rapid_api_geo_host,
    },
  };

  const response = await axios.request(options);

  if (response.statusText === 'No Content') {
    throw new BadRequestError('Uhm we dont have data for this continent');
  }
  const responseData = response.data;// Adjust based on the response structure

  // Check if countries already exist in the database
  const existingCountryCodes = await CountryModel.find({ continent }).distinct('code');

  const countriesToInsert: ICountry[] = responseData
    .filter((countryData: IGeographyResponseData) => !existingCountryCodes.includes(countryData.cca2))
    .map((countryData: IGeographyResponseData) => ({
      name: countryData.name.common,
      code: countryData.cca2,
      currencies: countryData.currencies ? countryData.currencies.map((currency: Record<string, any>) => ({
        name: currency.name,
        alphaCode: currency.alphaCode,
        symbol: currency.symbol,
      })) : null,
      capital: countryData.capital && countryData.capital.length > 0 ? countryData.capital[0].name : null,
      subRegion: countryData.subregion || null,
      languages: countryData.languages ? countryData.languages.map((language: any) => ({
        code: language.code,
        name: language.name,
      })) : null,
      flag: countryData.flags ? countryData.flags.svg : null,
      population: countryData.population || null,
      continent,
      mapUrl: countryData.maps ? countryData.maps.googleMaps : null,
      timezones: countryData.timezones || null,
    }));

  if (countriesToInsert.length > 0) {
    await CountryModel.insertMany(countriesToInsert);
  }

  const results = await CountryModel.find({ continent });
  return {
    results,
    extraFields: {
      query: {
        continent,
      },
    },
  };

};

export const getCountries = async (continent: string | undefined): Promise<Record<string, any>> => {
  const results = continent ? await CountryModel.find({ continent }) : await CountryModel.find();

  if (results && results.length === 0 && continent) {
    return loadCountries(continent);
  }
  return {
    results,
    extraFields: {
      query: {
        continent,
      },
    },
  };
};

export const updateCountryLastQueried = async (country: string) => {
  await CountryModel.findOneAndUpdate({ code: country }, { $set: { lastQueried: new Date() } }, { upsert: false})
};

export const getCountryByCode = async (countryCode: string): Promise<ICountryModel | null> => {
  return CountryModel.findOne(
    { code: countryCode });
};
export const getCountryById = async (countryId: string): Promise<ICountryModel | null> => {
  return CountryModel.findOne(
    { _id: countryId });
};

export const findAll = async (query: Record<string, any>): Promise<ICountryModel[] | null> => {
  return CountryModel.find(query);
}
