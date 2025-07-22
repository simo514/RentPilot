import express from 'express';
import rentalController from '../controllers/rental.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createRentalSchema } from '../validators/rental.validator.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rentals
 *   description: Car rental management endpoints
 */

/**
 * @swagger
 * /api/rentals:
 *   post:
 *     summary: Create a new rental
 *     tags: [Rentals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rental'
 *           example:
 *             client:
 *               firstName: "John"
 *               lastName: "Doe"
 *               phone: "+1234567890"
 *               email: "john.doe@example.com"
 *               dateOfBirth: "1990-01-15"
 *               nationality: "American"
 *               address: "123 Main St, City, State"
 *               clientID: "ID123456789"
 *               licenceNumber: "DL123456789"
 *               clientLicenseIssued: "2020-05-15"
 *             car:
 *               _id: "65f8e9a1b2c3d4e5f6789012"
 *               make: "Toyota"
 *               model: "Camry"
 *               year: 2022
 *               matricule: "ABC-1234"
 *               dailyRate: 50
 *             startDate: "2023-10-15T10:00:00Z"
 *             endDate: "2023-10-20T10:00:00Z"
 *             dailyRate: 50
 *             totalPrice: 250
 *             documents:
 *               - name: "Driver License"
 *                 image: "data:image/jpeg;base64,..."
 *                 uploadedAt: "2023-10-15T10:30:00Z"
 *               - name: "ID Card"
 *                 image: "data:image/jpeg;base64,..."
 *                 uploadedAt: "2023-10-15T10:31:00Z"
 *     responses:
 *       201:
 *         description: Rental created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rental created successfully"
 *                 rental:
 *                   $ref: '#/components/schemas/Rental'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/',
  validateRequest(createRentalSchema),
  rentalController.createRental
);

/**
 * @swagger
 * /api/rentals:
 *   get:
 *     summary: Get all rentals
 *     tags: [Rentals]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, returned]
 *         description: Filter by rental status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of rentals per page
 *     responses:
 *       200:
 *         description: List of rentals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rentals retrieved successfully"
 *                 rentals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Rental'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalRentals:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', rentalController.getAllRentals);

/**
 * @swagger
 * /api/rentals/{id}:
 *   get:
 *     summary: Get a specific rental by ID
 *     tags: [Rentals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID (MongoDB ObjectId)
 *         example: "65f8e9a1b2c3d4e5f6789012"
 *     responses:
 *       200:
 *         description: Rental retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rental retrieved successfully"
 *                 rental:
 *                   $ref: '#/components/schemas/Rental'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', rentalController.getRentalById);

/**
 * @swagger
 * /api/rentals/{id}/return:
 *   put:
 *     summary: Mark a rental as returned
 *     tags: [Rentals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID (MongoDB ObjectId)
 *         example: "65f8e9a1b2c3d4e5f6789012"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              
 *               returnNotes:
 *                 type: string
 *                 description: Notes about the return condition
 *                 example: "Car returned in good condition"
 *     responses:
 *       200:
 *         description: Rental returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rental returned successfully"
 *                 rental:
 *                   $ref: '#/components/schemas/Rental'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         description: Rental already returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id/return', rentalController.returnRental);

/**
 * @swagger
 * /api/rentals/{id}:
 *   delete:
 *     summary: Delete a rental
 *     tags: [Rentals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID (MongoDB ObjectId)
 *         example: "65f8e9a1b2c3d4e5f6789012"
 *     responses:
 *       200:
 *         description: Rental deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rental deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', rentalController.deleteRental);

export default router;
