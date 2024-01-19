import Joi from 'joi'

// Define the base schema with common options
export const baseSchema = Joi.object({
  // Add common fields here
  id: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date()

}).options({ stripUnknown: true })
