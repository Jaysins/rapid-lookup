import mongoose from 'mongoose';
import { BadRequestError } from '../../errors';
import { type ObjectSchema } from 'joi';

// Function to retrieve truthy value
export function convertToTruth(value: any): boolean {
  return typeof value !== 'undefined' && value !== null && String(value) !== '0' && value !== undefined;
}

export function serializeResponse(serializer: ObjectSchema, data: Record<string, any>): Record<string, any> {

  const { extraFields = null } = data;

  if (convertToTruth(extraFields)) {
    data = data.result ?? data.results;
  }

  if (Array.isArray(data)) {
    const validatedDataArray: any[] = [];
    data.forEach(obj => {
      obj = obj instanceof mongoose.Model ? obj.toObject() : obj;
      const { error, value } = serializer.validate(obj);
      if (error) {
        throw new BadRequestError(error.details.map((detail: { message: any }) => detail.message).join(', '));
      } else {
        validatedDataArray.push(value);
      }
    });
    return { results: validatedDataArray, ...extraFields };
  }

  if (data instanceof mongoose.Model) {
    data = data.toObject();
  }

  const { error, value } = serializer.validate(data);
  if (error) {
    throw new BadRequestError(error.details.map((detail: { message: any }) => detail.message).join(', '));
  }
  return { ...value, ...extraFields };
}
