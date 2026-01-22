import Car from '../models/Car.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';

const carController = {
  // Create a car
  createCar: catchAsync(async (req, res, next) => {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    
    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      car: savedCar,
    });
  }),

  // Get all cars
  getAllCars: catchAsync(async (req, res, next) => {
    const cars = await Car.find();
    
    res.status(200).json({
      success: true,
      results: cars.length,
      cars,
    });
  }),

  // Get car by ID
  getCarById: catchAsync(async (req, res, next) => {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      throw new AppError('Car not found', 404);
    }
    
    res.status(200).json({
      success: true,
      car,
    });
  }),

  // Delete a car
  deleteCar: catchAsync(async (req, res, next) => {
    const deleted = await Car.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      throw new AppError('Car not found', 404);
    }
    
    res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
    });
  }),

  // Update car availability
  updateAvailability: catchAsync(async (req, res, next) => {
    const { available } = req.body;
    
    const updated = await Car.findByIdAndUpdate(
      req.params.id,
      { available },
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      throw new AppError('Car not found', 404);
    }
    
    res.status(200).json({
      success: true,
      message: 'Car availability updated successfully',
      car: updated,
    });
  }),

  // Update car details
  updateCar: catchAsync(async (req, res, next) => {
    const updated = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      throw new AppError('Car not found', 404);
    }
    
    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      car: updated,
    });
  }),
};

export default carController;
