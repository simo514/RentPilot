/**
 * car.controller tests
 * Uses jest.unstable_mockModule + top-level await (required for ESM + --experimental-vm-modules)
 */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/Car.js', () => {
  const MockCar = jest.fn().mockImplementation(() => ({ save: jest.fn() }));
  MockCar.find = jest.fn();
  MockCar.findById = jest.fn();
  MockCar.findByIdAndDelete = jest.fn();
  MockCar.findByIdAndUpdate = jest.fn();
  return { default: MockCar };
});

jest.unstable_mockModule('../services/uploadImage.js', () => ({
  default: jest.fn().mockResolvedValue('https://cloudinary.test/car.jpg'),
}));

const { default: carController } = await import('../controllers/car.controller.js');
const { default: Car } = await import('../models/Car.js');
const { default: uploadImage } = await import('../services/uploadImage.js');

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('carController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    uploadImage.mockResolvedValue('https://cloudinary.test/car.jpg');
  });

  // ---------------------------------------------------------------------------
  // createCar
  // ---------------------------------------------------------------------------
  describe('createCar', () => {
    it('creates a car without image upload when no image provided', async () => {
      req.body = { make: 'Toyota', model: 'Corolla', matricule: 'AB-123-CD' };
      Car.prototype.save = jest.fn().mockResolvedValue({ _id: 'cid', ...req.body });
      carController.createCar(req, res, next);
      await flushPromises();
      expect(uploadImage).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: expect.any(String) })
      );
    });

    it('uploads image to cloudinary when image field is present', async () => {
      req.body = { make: 'Honda', model: 'Civic', matricule: 'XY-999-Z', image: 'base64data' };
      Car.prototype.save = jest.fn().mockResolvedValue({ _id: 'cid' });
      carController.createCar(req, res, next);
      await flushPromises();
      expect(uploadImage).toHaveBeenCalledWith('base64data');
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  // ---------------------------------------------------------------------------
  // getAllCars
  // ---------------------------------------------------------------------------
  describe('getAllCars', () => {
    it('returns all cars with success wrapper', async () => {
      const mockCars = [{ _id: 'c1' }, { _id: 'c2' }];
      Car.find.mockResolvedValue(mockCars);
      carController.getAllCars(req, res, next);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, results: 2, cars: mockCars })
      );
    });

    it('returns empty array when no cars exist', async () => {
      Car.find.mockResolvedValue([]);
      carController.getAllCars(req, res, next);
      await flushPromises();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ results: 0, cars: [] })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // getCarById
  // ---------------------------------------------------------------------------
  describe('getCarById', () => {
    it('returns car wrapped in success object', async () => {
      req.params.id = 'cid';
      const carDoc = { _id: 'cid', make: 'BMW' };
      Car.findById.mockResolvedValue(carDoc);
      carController.getCarById(req, res, next);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, car: carDoc })
      );
    });

    it('calls next with 404 AppError if car not found', async () => {
      req.params.id = 'cid';
      Car.findById.mockResolvedValue(null);
      carController.getCarById(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404, isOperational: true })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // deleteCar
  // ---------------------------------------------------------------------------
  describe('deleteCar', () => {
    it('deletes car and returns success message', async () => {
      req.params.id = 'cid';
      Car.findByIdAndDelete.mockResolvedValue({ _id: 'cid' });
      carController.deleteCar(req, res, next);
      await flushPromises();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: expect.any(String) })
      );
    });

    it('calls next with 404 AppError if car not found', async () => {
      req.params.id = 'cid';
      Car.findByIdAndDelete.mockResolvedValue(null);
      carController.deleteCar(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404, isOperational: true })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // updateAvailability
  // ---------------------------------------------------------------------------
  describe('updateAvailability', () => {
    it('updates availability and returns updated car', async () => {
      req.params.id = 'cid';
      req.body = { available: false };
      const updated = { _id: 'cid', available: false };
      Car.findByIdAndUpdate.mockResolvedValue(updated);
      carController.updateAvailability(req, res, next);
      await flushPromises();
      expect(Car.findByIdAndUpdate).toHaveBeenCalledWith(
        'cid',
        { available: false },
        { new: true, runValidators: true }
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('calls next with 404 AppError if car not found', async () => {
      req.params.id = 'cid';
      req.body = { available: true };
      Car.findByIdAndUpdate.mockResolvedValue(null);
      carController.updateAvailability(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404, isOperational: true })
      );
    });
  });
});
