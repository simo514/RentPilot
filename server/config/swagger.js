import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RentPilot API',
      version: '1.0.0',
      description: 'A comprehensive car rental management system API',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        url: 'https://api.rentpilot.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Car: {
          type: 'object',
          required: ['make', 'model', 'year', 'matricule', 'dailyRate'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
            },
            make: {
              type: 'string',
              description: 'Car manufacturer',
              example: 'Toyota',
            },
            model: {
              type: 'string',
              description: 'Car model',
              example: 'Camry',
            },
            year: {
              type: 'integer',
              description: 'Manufacturing year',
              example: 2022,
            },
            matricule: {
              type: 'string',
              description: 'License plate number',
              example: 'ABC-1234',
            },
            dailyRate: {
              type: 'number',
              description: 'Daily rental rate in currency',
              example: 50.00,
            },
            available: {
              type: 'boolean',
              description: 'Availability status',
              default: true,
            },
            image: {
              type: 'string',
              description: 'Car image URL',
              example: 'https://example.com/car-image.jpg',
            },
          },
        },
        Client: {
          type: 'object',
          required: ['firstName', 'lastName', 'phone', 'email'],
          properties: {
            firstName: {
              type: 'string',
              description: 'Client first name',
              example: 'John',
            },
            lastName: {
              type: 'string',
              description: 'Client last name',
              example: 'Doe',
            },
            phone: {
              type: 'string',
              description: 'Client phone number',
              example: '+1234567890',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Client email address',
              example: 'john.doe@example.com',
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Client date of birth',
              example: '1990-01-15',
            },
            nationality: {
              type: 'string',
              description: 'Client nationality',
              example: 'American',
            },
            address: {
              type: 'string',
              description: 'Client address',
              example: '123 Main St, City, State',
            },
            clientID: {
              type: 'string',
              description: 'Client ID/Passport number',
              example: 'ID123456789',
            },
            licenceNumber: {
              type: 'string',
              description: 'Driver license number',
              example: 'DL123456789',
            },
            clientLicenseIssued: {
              type: 'string',
              format: 'date',
              description: 'License issue date',
              example: '2020-05-15',
            },
          },
        },
        Document: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Document name',
              example: 'Driver License',
            },
            image: {
              type: 'string',
              description: 'Base64 encoded image data',
              example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...',
            },
            uploadedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Upload timestamp',
              example: '2023-10-15T10:30:00Z',
            },
          },
        },
        Rental: {
          type: 'object',
          required: ['client', 'car', 'startDate', 'endDate', 'dailyRate', 'totalPrice'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
            },
            client: {
              $ref: '#/components/schemas/Client',
            },
            car: {
              $ref: '#/components/schemas/Car',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Rental start date and time',
              example: '2023-10-15T10:00:00Z',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Rental end date and time',
              example: '2023-10-20T10:00:00Z',
            },
            dailyRate: {
              type: 'number',
              description: 'Daily rental rate',
              example: 50.00,
            },
            totalPrice: {
              type: 'number',
              description: 'Total rental price',
              example: 250.00,
            },
            status: {
              type: 'string',
              enum: ['active', 'returned'],
              description: 'Rental status',
              default: 'active',
            },
            documents: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Document',
              },
              description: 'Uploaded documents',
            },
            rentalAgreement: {
              type: 'string',
              description: 'Generated rental agreement HTML',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        ContractTemplate: {
          type: 'object',
          required: ['name', 'html'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
            },
            name: {
              type: 'string',
              description: 'Template name',
              example: 'Standard Rental Agreement',
            },
            html: {
              type: 'string',
              description: 'HTML template content with placeholders',
              example: '<html><body>{{client.firstName}} {{client.lastName}}</body></html>',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Resource not found',
            },
            error: {
              type: 'string',
              description: 'Error details',
              example: 'The requested resource could not be found',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Validation error message',
              example: 'Validation failed',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field name that failed validation',
                  },
                  message: {
                    type: 'string',
                    description: 'Validation error message for the field',
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
