import { Request, Response } from 'express';
import * as CatalogueService from '../services/catalogue';
import asyncHandler from 'express-async-handler';
import { serializeResponse } from '../shared/utils/helper';
import logger from '../shared/utils/logger';
import { BadRequestError } from '../errors';
import { catalogueResponseSchema } from '../schemas/catalogue';

const methodStatus: Record<string, number> = {
  POST: 201,
  PUT: 200,
  GET: 201,
};

export const getCatalogues = asyncHandler(async (req: Request, res: Response) => {
  const country = req.query.country as string;
  if (!country) {
    throw new BadRequestError('Country required');
  }
  logger.info(`iam one, ${country}`);
  const result = await CatalogueService.getCatalogues(country.toUpperCase());
  res.status(methodStatus[req.method]).json(serializeResponse(catalogueResponseSchema, result));
});
