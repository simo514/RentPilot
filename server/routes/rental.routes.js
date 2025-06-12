import express from 'express';
import rentalController from '../controllers/rental.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createRentalSchema } from '../validators/rental.validator.js';

const router = express.Router();

// POST /api/rentals → Create a new rental
router.post(
  '/',
  validateRequest(createRentalSchema),
  rentalController.createRental
);

// GET /api/rentals → Get all rentals
router.get('/', rentalController.getAllRentals);

// GET /api/rentals/:id → Get a specific rental
router.get('/:id', rentalController.getRentalById);

// PUT /api/rentals/:id → return a rental
router.put('/:id/return', rentalController.returnRental);

// DELETE /api/rentals/:id → Delete a rental
router.delete('/:id', rentalController.deleteRental);

export default router;
