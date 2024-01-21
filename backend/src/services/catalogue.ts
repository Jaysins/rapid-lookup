import axios from 'axios';
import crypto from 'crypto';
import CatalogueModel from '../models/catalogue';
import { config } from '../config';
import { BadRequestError } from '../errors';
import * as CountryService from './country';
import { type ICatalogue, type ICatalogueResponseData } from '../types/catalogue';

const generateCatalogHash = (catalogData: any): string => {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(catalogData));
  return hash.digest('hex');
};

const getDateString = (days?: number | null, setDate?: Date | null): string => {

  const currentDate = setDate ?? new Date();

  if (days) {
    currentDate.setDate(currentDate.getDate() - days);
  }
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentDay = String(currentDate.getDate()).padStart(2, '0');
  return `${currentYear}-${currentMonth}-${currentDay}`;
};

export const loadCatalogues = async (countryId: string, startDate?: Date | null): Promise<Record<string, any>> => {

  const country = await CountryService.getCountryById(countryId);
  if (!country) {
    throw new BadRequestError('Nothing with this country chief');
  }

  const params: Record<string, any> = {
    query: country.name,
    end_date: getDateString(),
  };

  if (startDate) {
    params.start_date = getDateString(null, startDate);
  }

  const options = {
    method: 'GET',
    url: config.integration.rapid_api_news_url,
    params,
    headers: {
      'X-RapidAPI-Key': config.integration.rapid_api_key,
      'X-RapidAPI-Host': config.integration.rapid_api_news_host,
    },
  };

  const response = await axios.request(options);

  if (response.statusText === 'No Content') {
    throw new BadRequestError('Uhm we dont have data for this country');
  }
  const responseData = response.data;

  console.log(responseData)
  const existingCatalogHashes = await CatalogueModel.find({ country: countryId }).distinct('hash');

  const cataloguesToInsert: ICatalogue[] = responseData
    .filter((catalogueData: ICatalogueResponseData) => {
      // Generate hash for the current catalog data
      const hash = generateCatalogHash(catalogueData);

      // Add hash to the catalog data
      catalogueData.hash = hash;

      // Check if the hash already exists in the database
      return !existingCatalogHashes.includes(hash);
    })
    .map((catalogueData: ICatalogueResponseData) => ({
      title: catalogueData.title,
      url: catalogueData.url,
      publishedDate: catalogueData['published date'],
      publisher: catalogueData.publisher.title,
      country: countryId,
      hash: catalogueData.hash,
    }));

  if (cataloguesToInsert.length > 0) {
    await CatalogueModel.insertMany(cataloguesToInsert);
  }

  // noinspection ES6MissingAwait
  CountryService.updateCountryLastQueried(countryId);

  const results = await CatalogueModel.find({ country: countryId }).populate('country').sort('-publishedDate');
  return {
    results,
    extraFields: {
      query: {
        country: country.name,
      },
    },
  };

};

export const getCatalogues = async (countryId: string): Promise<Record<string, any>> => {

  const results = await CatalogueModel.find({ country: countryId }).populate('country').sort('-publishedDate');

  if (results && results.length === 0 && countryId) {
    return loadCatalogues(countryId);
  }
  // noinspection ES6MissingAwait
  CountryService.updateCountryLastQueried(countryId);

  return {
    results,
    extraFields: {
      query: {
        countryId,
      },
    },
  };
};

export const updateRecentCatalog = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  // Find countries where lastQueried is not less than three days ago
  const outdatedCountries = await CountryService.findAll({ lastQueried: { $gte: threeDaysAgo } });
  if (!outdatedCountries) {
    return;
  }
  // Fetch the most recent catalog for each outdated country
  for (const country of outdatedCountries) {
    await loadCatalogues(country.id, country.lastQueried);
  }
};
