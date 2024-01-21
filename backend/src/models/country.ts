import mongoose, { Schema, Document } from 'mongoose';
import { ICountry } from '../types/country';
import { baseSchema } from './base';

export interface ICountryModel extends ICountry, Document {}

const countrySchema = new Schema<ICountryModel>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  currencies: [{
    name: { type: String, required: true },
    alphaCode: { type: String, required: true },
    symbol: { type: String, required: false },
  }],
  capital: { type: String, required: false },
  subRegion: { type: String, required: false },
  languages: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
  }],
  flag: { type: String, required: false },
  continent: { type: String, required: true },
  population: { type: Number, required: true },
  mapUrl: { type: String, required: true },
  timezones: [{ type: String, required: true }],
  lastQueried: { type: Date, default: Date.now, required: false },
});

countrySchema.add(baseSchema)

// Create the Mongoose model
const CountryModel = mongoose.model<ICountryModel>('Country', countrySchema);

export default CountryModel;
