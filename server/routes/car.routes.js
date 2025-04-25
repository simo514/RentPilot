import express from 'express';
const router = express.Router();
import carController from '../controllers/car.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createCarSchema } from '../validators/car.validator.js';

// Create a new car
router.post('/', validateRequest(createCarSchema), carController.createCar);

// Get all cars
router.get('/', carController.getAllCars);

// Get a car by ID
router.get('/:id', carController.getCarById);

// Delete a car
router.delete('/:id', carController.deleteCar);

// Update car availability (optional endpoint)
router.put('/:id/availability', carController.updateAvailability);

export default router;