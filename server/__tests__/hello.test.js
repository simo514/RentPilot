import rentalController from '../controllers/rental.controller.js';
import Rental from '../models/Rental.js';
import Car from '../models/Car.js';
import uploadImage from '../services/uploadImage.js';

jest.mock('../models/Rental.js');
jest.mock('../models/Car.js');
jest.mock('../services/uploadImage.js');

uploadImage.mockImplementation(async (img) => 'mocked_image_url');

describe('rentalController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createRental', () => {
    it('should return 400 if dailyRate is invalid', async () => {
      req.body = { dailyRate: 0 };
      await rentalController.createRental(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      );
    });

    it('should return 404 if car not found', async () => {
      req.body = { dailyRate: 10, carId: 'carid' };
      Car.findById.mockResolvedValue(null);
      await rentalController.createRental(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if car is not available', async () => {
      req.body = { dailyRate: 10, carId: 'carid' };
      Car.findById.mockResolvedValue({ available: false });
      await rentalController.createRental(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if end date is before start date', async () => {
      req.body = {
        dailyRate: 10,
        carId: 'carid',
        startDate: '2024-01-02',
        endDate: '2024-01-01',
      };
      Car.findById.mockResolvedValue({
        available: true,
        _id: 'carid',
        save: jest.fn(),
      });
      await rentalController.createRental(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should create rental and mark car unavailable', async () => {
      req.body = {
        dailyRate: 10,
        carId: 'carid',
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        client: 'clientid',
      };
      const carMock = { available: true, _id: 'carid', save: jest.fn() };
      Car.findById.mockResolvedValue(carMock);
      Rental.prototype.save = jest.fn().mockResolvedValue({ _id: 'rentalid' });
      await rentalController.createRental(req, res);
      expect(carMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
          rental: expect.any(Object),
        })
      );
    });
  });

  describe('getAllRentals', () => {
    it('should return all rentals', async () => {
      Rental.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([{}]),
      });
      await rentalController.getAllRentals(req, res);
      expect(res.json).toHaveBeenCalledWith([{}]);
    });
  });

  describe('getRentalById', () => {
    it('should return rental by id', async () => {
      req.params.id = 'rentalid';
      Rental.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ _id: 'rentalid' }),
      });
      await rentalController.getRentalById(req, res);
      expect(res.json).toHaveBeenCalledWith({ _id: 'rentalid' });
    });

    it('should return 404 if rental not found', async () => {
      req.params.id = 'rentalid';
      Rental.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      await rentalController.getRentalById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('returnRental', () => {
    it('should mark car as available and rental as completed', async () => {
      req.params.id = 'rentalid';
      const rentalMock = { car: 'carid', status: '', save: jest.fn() };
      const carMock = { available: false, save: jest.fn() };
      Rental.findById.mockResolvedValue(rentalMock);
      Car.findById.mockResolvedValue(carMock);
      await rentalController.returnRental(req, res);
      expect(carMock.save).toHaveBeenCalled();
      expect(rentalMock.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      );
    });

    it('should return 404 if rental not found', async () => {
      Rental.findById.mockResolvedValue(null);
      await rentalController.returnRental(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 404 if car not found', async () => {
      Rental.findById.mockResolvedValue({ car: 'carid' });
      Car.findById.mockResolvedValue(null);
      await rentalController.returnRental(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteRental', () => {
    it('should delete rental', async () => {
      req.params.id = 'rentalid';
      Rental.findByIdAndDelete.mockResolvedValue({ _id: 'rentalid' });
      await rentalController.deleteRental(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      );
    });

    it('should return 404 if rental not found', async () => {
      Rental.findByIdAndDelete.mockResolvedValue(null);
      await rentalController.deleteRental(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
