import { Request, Response } from 'express';
import * as CountryService from '../services/country';
import asyncHandler from 'express-async-handler';
import { serializeResponse } from '../shared/utils/helper';
import {countryResponseSchema} from '../schemas/country';
import logger from '../shared/utils/logger';

const methodStatus: Record<string, number> = {
  POST: 201,
  PUT: 200,
  GET: 201
}

export const getCountries = asyncHandler(async (req: Request, res: Response) => {
  const continent = req.query.continent as string | undefined
  logger.info(`iam one, ${continent}`)
  const result = await CountryService.getCountries(continent?.toLowerCase());
  res.status(methodStatus[req.method]).json(serializeResponse(countryResponseSchema, result))
});
