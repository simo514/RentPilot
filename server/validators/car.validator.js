import Joi from 'joi';

export const createCarSchema = Joi.object({
  make: Joi.string().required().messages({
    'any.required': 'Make is required',
    'string.base': 'Make must be a string',
  }),
  model: Joi.string().required().messages({
    'any.required': 'Model is required',
    'string.base': 'Model must be a string',
  }),
  year: Joi.number().integer().min(1900).required().max(new Date().getFullYear()).messages({
    'any.required': 'Year is required',
    'number.base': 'Year must be a number',
    'number.min': 'Year must be greater than or equal to 1900',
    'number.max': `Year must be less than or equal to ${new Date().getFullYear()}`,
  }),
  matricule: Joi.string().required().messages({
    'any.required': 'Matricule (plate number) is required',
  }),
  available: Joi.boolean(),
  image: Joi.string().required().messages({
  'any.required': 'Image is required',
})
});
