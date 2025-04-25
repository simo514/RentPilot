import Joi from 'joi';

export const createRentalSchema = Joi.object({
  client: Joi.object({
    firstName: Joi.string().required().messages({
      'any.required': 'Client first name is required',
      'string.base': 'First name must be a string',
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Client last name is required',
      'string.base': 'Last name must be a string',
    }),
    phone: Joi.string().optional(),
    email: Joi.string().email().optional()
  }).required().messages({
    'any.required': 'Client information is required'
  }),

  carId: Joi.string().required().messages({
    'any.required': 'Car ID is required'
  }),

  startDate: Joi.date().required().messages({
    'any.required': 'Start date is required',
    'date.base': 'Start date must be a valid date',
  }),

  endDate: Joi.date().required().messages({
    'any.required': 'End date is required',
    'date.base': 'End date must be a valid date',
  }),

  dailyRate: Joi.number().positive().required().messages({
    'any.required': 'Daily rate is required',
    'number.base': 'Daily rate must be a number',
    'number.positive': 'Daily rate must be greater than 0',
  })
});
