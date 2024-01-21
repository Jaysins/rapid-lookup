import { baseSchema } from '../base/schema';
import Joi from 'joi';
import { countryResponseSchema } from './country';
const catalogueResponseSchema = baseSchema.keys({
  title: Joi.string(),
  url: Joi.string(),
  publisher: Joi.string(),
  country: countryResponseSchema,
  publishedDate: Joi.date(),
});

export {
  catalogueResponseSchema
};
