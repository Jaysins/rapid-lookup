import mongoose, { Schema, Document } from 'mongoose';
import { ICatalogue } from '../types/catalogue';
import { baseSchema } from './base';

export interface ICatalogueModel extends ICatalogue, Document {}

const catalogueSchema = new Schema<ICatalogueModel>({
  title: { required: true, type: String },
  country: { required: true, type: Schema.Types.ObjectId, ref: 'Country' },
  publishedDate: { type: Date, required: false },
  url: { required: true, type: String },
  hash: {required: false, type: String},
  publisher: { required: true, type: String },
});

catalogueSchema.add(baseSchema);
// Create the Mongoose model

const CatalogueModel = mongoose.model<ICatalogueModel>('Catalogue', catalogueSchema);

export default CatalogueModel;
