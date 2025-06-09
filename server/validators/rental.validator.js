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
    phone: Joi.string().allow('').optional(),
    email: Joi.string().email().allow('').optional(),
    dateOfBirth: Joi.date().allow('').optional(),
    address: Joi.string().allow('').optional(),
    nationality: Joi.string().allow('').optional(),
    clientID: Joi.string().allow('').optional(),
    licenceNumber: Joi.string().allow('').optional(),
    clientLicenseIssued: Joi.date().allow('').optional()
  }).messages({
    'any.required': 'Client information is required'
  }),

  carId: Joi.string().required().messages({
    'any.required': 'Car ID is required'
  }),

  departureLocation: Joi.string().allow('').optional(),
  returnLocation: Joi.string().allow('').optional(),

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
  }),

  rentalAgreement: Joi.string().allow('').optional().messages({
    'string.base': 'Rental agreement must be a string',
  }),

  documents: Joi.array().items(
    Joi.object({
      name: Joi.string().required().messages({
        'any.required': 'Document name is required',
        'string.base': 'Document name must be a string',
      }),
      image: Joi.string().uri().required().messages({
        'any.required': 'Document image URL is required',
        'string.base': 'Document image must be a string',
        'string.uri': 'Document image must be a valid URL',
      }),
      uploadedAt: Joi.date().required().messages({
        'any.required': 'Document upload date is required',
        'date.base': 'Uploaded date must be a valid date',
      }),
    })
  ).optional().messages({
    'array.base': 'Documents must be an array of objects',
  }),
});
