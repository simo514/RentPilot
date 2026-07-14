/**
 * rental.controller tests
 * Uses jest.unstable_mockModule + top-level await (required for ESM + --experimental-vm-modules)
 */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Rental.js', () => {
  const MockRental = jest.fn().mockImplementation(() => ({ save: jest.fn() }));
  MockRental.find = jest.fn();
  MockRental.findById = jest.fn();
  MockRental.findByIdAndDelete = jest.fn();
  return { default: MockRental };
});

jest.unstable_mockModule('../models/Car.js', () => ({
  default: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.unstable_mockModule('../services/uploadImage.js', () => ({
  default: jest.fn().mockResolvedValue('https://cloudinary.test/image.jpg'),
}));

const { default: rentalController } = await import('../controllers/rental.controller.js');
const { default: Rental } = await import('../models/Rental.js');
const { default: Car } = await import('../models/Car.js');
const { default: uploadImage } = await import('../services/uploadImage.js');

// Helper: build a chainable Mongoose query mock that resolves to `value`
const makeQuery = (value) => {
  const chain = {
    populate: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    then: (resolve, reject) => Promise.resolve(value).then(resolve, reject),
  };
  // Make it thenable so `await query` works
  chain[Symbol.iterator] = undefined;
  return chain;
};

// catchAsync does not return the floating promise — drain the queue so all
// async controller work (mocked db calls etc.) finishes before asserting.
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('rentalController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: {}, query: {}, files: null };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    uploadImage.mockResolvedValue('https://cloudinary.test/image.jpg');
  });

  // ---------------------------------------------------------------------------
  // createRental — error paths call next(AppError), NOT res.status
  // ---------------------------------------------------------------------------
  describe('createRental', () => {
    it('calls next with 400 AppError if dailyRate is 0', async () => {
      req.body = { dailyRate: 0, carId: 'cid', startDate: '2024-01-01', endDate: '2024-01-03' };
      rentalController.createRental(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, isOperational: true })
      );
    });

    it('calls next with 400 AppError if dailyRate is missing', async () => {
      req.body = { carId: 'cid', startDate: '2024-01-01', endDate: '2024-01-03' };
      rentalController.createRental(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, isOperational: true })
      );
    });

    it('calls next with 404 AppError if car not found', async () => {
      req.body = { dailyRate: 100, carId: 'cid', startDate: '2024-01-01', endDate: '2024-01-03' };
      Car.findById.mockResolvedValue(null);
      rentalController.createRental(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404, isOperational: true })
      );
    });

    it('calls next with 400 AppError if car is not available', async () => {
      req.body = { dailyRate: 100, carId: 'cid', startDate: '2024-01-01', endDate: '2024-01-03' };
      Car.findById.mockResolvedValue({ available: false });
      rentalController.createRental(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, isOperational: true })
      );
    });

    it('calls next with 400 AppError if endDate is before startDate', async () => {
      req.body = {
        dailyRate: 100, carId: 'cid',
        startDate: '2024-01-05', endDate: '2024-01-02',
      };
      Car.findById.mockResolvedValue({ available: true, _id: 'cid', save: jest.fn() });
      rentalController.createRental(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, isOperational: true })
      );
    });

    it('creates rental, marks car unavailable, returns 201', async () => {
      const carMock = { available: true, _id: 'cid', save: jest.fn() };
      const savedRental = { _id: 'rid', car: 'cid' };
      req.body = {
        client: { firstName: 'Alice', lastName: 'Smith' },
        dailyRate: 100, carId: 'cid',
        startDate: '2024-01-01', endDate: '2024-01-04',
        totalPrice: 360, rentalDuration: 3,
        departureLocation: 'TANGER', returnLocation: 'TANGER',
        createdAt: new Date().toISOString(),
      };
      Car.findById.mockResolvedValue(carMock);
      Rental.prototype.save = jest.fn().mockResolvedValue(savedRental);
      rentalController.createRental(req, res, next);
      await flushPromises();
      expect(carMock.available).toBe(false);
      expect(carMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: expect.any(String) })
      );
    });

    it('uploads document files to cloudinary when files are provided', async () => {
      const carMock = { available: true, _id: 'cid', save: jest.fn() };
      req.body = {
        client: { firstName: 'Alice', lastName: 'Smith' },
        dailyRate: 100, carId: 'cid',
        startDate: '2024-01-01', endDate: '2024-01-04',
        totalPrice: 360, rentalDuration: 3,
      };
      req.files = {
        driverLicense: [{ buffer: Buffer.from('dl') }],
        idCard: [{ buffer: Buffer.from('id') }],
      };
      Car.findById.mockResolvedValue(carMock);
      Rental.prototype.save = jest.fn().mockResolvedValue({ _id: 'rid' });
      rentalController.createRental(req, res, next);
      await flushPromises();
      expect(uploadImage).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  // ---------------------------------------------------------------------------
  // getAllRentals
  // ---------------------------------------------------------------------------
  describe('getAllRentals', () => {
    it('returns all rentals with success wrapper', async () => {
      const mockRentals = [{ _id: 'r1' }, { _id: 'r2' }];
      Rental.find.mockReturnValue(makeQuery(mockRentals));
      rentalController.getAllRentals(req, res, next);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, results: 2, rentals: mockRentals })
      );
    });

    it('applies month/year filter when provided', async () => {
      req.query = { month: '0', year: '2024' };
      Rental.find.mockReturnValue(makeQuery([{ _id: 'r1' }]));
      rentalController.getAllRentals(req, res, next);
      await flushPromises();
      const filterArg = Rental.find.mock.calls[0][0];
      expect(filterArg).toHaveProperty('startDate.$gte');
      expect(filterArg).toHaveProperty('startDate.$lt');
    });

    it('uses default sort -createdAt for unknown sort value', async () => {
      req.query = { sort: 'INVALID' };
      const chain = makeQuery([]);
      Rental.find.mockReturnValue(chain);
      rentalController.getAllRentals(req, res, next);
      await flushPromises();
      expect(chain.sort).toHaveBeenCalledWith('-createdAt');
    });

    it('accepts whitelisted sort values', async () => {
      req.query = { sort: '-totalPrice' };
      const chain = makeQuery([]);
      Rental.find.mockReturnValue(chain);
      rentalController.getAllRentals(req, res, next);
      await flushPromises();
      expect(chain.sort).toHaveBeenCalledWith('-totalPrice');
    });

    it('applies limit when provided', async () => {
      req.query = { limit: '5' };
      const chain = makeQuery([]);
      Rental.find.mockReturnValue(chain);
      rentalController.getAllRentals(req, res, next);
      await flushPromises();
      expect(chain.limit).toHaveBeenCalledWith(5);
    });

    it('does not call limit when not provided', async () => {
      const chain = makeQuery([]);
      Rental.find.mockReturnValue(chain);
      rentalController.getAllRentals(req, res, next);
      await flushPromises();
      expect(chain.limit).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // getRentalById
  // ---------------------------------------------------------------------------
  describe('getRentalById', () => {
    it('returns rental wrapped in success object', async () => {
      req.params.id = 'rid';
      const rentalDoc = { _id: 'rid', client: {} };
      Rental.findById.mockReturnValue(makeQuery(rentalDoc));
      rentalController.getRentalById(req, res, next);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, rental: rentalDoc })
      );
    });

    it('calls next with 404 AppError if rental not found', async () => {
      req.params.id = 'rid';
      Rental.findById.mockReturnValue(makeQuery(null));
      rentalController.getRentalById(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404, isOperational: true })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // returnRental
  // ---------------------------------------------------------------------------
  describe('returnRental', () => {
    it('marks car available, rental completed, returns success', async () => {
      req.params.id = 'rid';
      const rentalMock = { car: 'cid', status: 'active', save: jest.fn() };
      const carMock = { available: false, save: jest.fn() };
      Rental.findById.mockResolvedValue(rentalMock);
      Car.findById.mockResolvedValue(carMock);
      rentalController.returnRental(req, res, next);
      await flushPromises();
      expect(carMock.available).toBe(true);
      expect(rentalMock.status).toBe('completed');
      expect(carMock.save).toHaveBeenCalled();
      expect(rentalMock.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: expect.any(String) })
      );
    });

    it('calls next with 404 AppError if rental not found', async () => {
      req.params.id = 'rid';
      Rental.findById.mockResolvedValue(null);
      rentalController.returnRental(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404, isOperational: true })
      );
    });

    it('calls next with 404 AppError if car not found', async () => {
      req.params.id = 'rid';
      Rental.findById.mockResolvedValue({ car: 'cid', save: jest.fn() });
      Car.findById.mockResolvedValue(null);
      rentalController.returnRental(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404, isOperational: true })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // deleteRental
  // ---------------------------------------------------------------------------
  describe('deleteRental', () => {
    it('deletes rental and returns success', async () => {
      req.params.id = 'rid';
      const rentalMock = { _id: 'rid', car: 'cid' };
      const carMock = { available: true };
      Rental.findById.mockResolvedValue(rentalMock);
      Car.findById.mockResolvedValue(carMock);
      Rental.findByIdAndDelete.mockResolvedValue(rentalMock);
      rentalController.deleteRental(req, res, next);
      await flushPromises();
      expect(Rental.findByIdAndDelete).toHaveBeenCalledWith('rid');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: expect.any(String) })
      );
    });

    it('calls next with 404 AppError if rental not found', async () => {
      req.params.id = 'rid';
      Rental.findById.mockResolvedValue(null);
      rentalController.deleteRental(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404, isOperational: true })
      );
    });

    it('calls next with 400 AppError for active rental with unavailable car', async () => {
      req.params.id = 'rid';
      Rental.findById.mockResolvedValue({ _id: 'rid', car: 'cid' });
      Car.findById.mockResolvedValue({ available: false });
      rentalController.deleteRental(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, isOperational: true })
      );
    });
  });
});
