import { baseSchema } from '../base/schema';
import Joi from 'joi';

const countryResponseSchema = baseSchema.keys({
  name: Joi.string(),
  code: Joi.string(),
  currencies: Joi.array().items(Joi.object({
    name: Joi.string(),
    alphaCode: Joi.string(),
    symbol: Joi.string(),
  })),
  capital: Joi.string(),
  subRegion: Joi.string(),
  languages: Joi.array().items(Joi.object({
    code: Joi.string(),
    name: Joi.string(),
  })),
  flag: Joi.string(),
  continent: Joi.string(),
  population: Joi.number(),
  mapUrl: Joi.string(),
  timezones: Joi.array().items(Joi.string()),
});

export {
  countryResponseSchema
};
