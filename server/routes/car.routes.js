import express from 'express';
const router = express.Router();
import carController from '../controllers/car.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createCarSchema } from '../validators/car.validator.js';

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Car management endpoints
 */

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *           example:
 *             make: "Toyota"
 *             model: "Camry"
 *             year: 2022
 *             color: "Blue"
 *             matricule: "ABC-1234"
 *             dailyRate: 50
 *             available: true
 *             mileage: 12000
 *             fuelType: "Gasoline"
 *             transmission: "Automatic"
 *             imageUrl: "https://example.com/car-image.jpg"
 *     responses:
 *       201:
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Car created successfully"
 *                 car:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', validateRequest(createCarSchema), carController.createCar);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter by availability (true for available only)
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Filter by car make
 *       - in: query
 *         name: minRate
 *         schema:
 *           type: number
 *         description: Minimum daily rate filter
 *       - in: query
 *         name: maxRate
 *         schema:
 *           type: number
 *         description: Maximum daily rate filter
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
 *         description: Number of cars per page
 *     responses:
 *       200:
 *         description: List of cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cars retrieved successfully"
 *                 cars:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalCars:
 *                       type: integer
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', carController.getAllCars);

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get a car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID (MongoDB ObjectId)
 *         example: "65f8e9a1b2c3d4e5f6789012"
 *     responses:
 *       200:
 *         description: Car retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Car retrieved successfully"
 *                 car:
 *                   $ref: '#/components/schemas/Car'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', carController.getCarById);

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete a car
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID (MongoDB ObjectId)
 *         example: "65f8e9a1b2c3d4e5f6789012"
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Car deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', carController.deleteCar);

/**
 * @swagger
 * /api/cars/{id}/availability:
 *   put:
 *     summary: Update car availability
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID (MongoDB ObjectId)
 *         example: "65f8e9a1b2c3d4e5f6789012"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               available:
 *                 type: boolean
 *                 description: Car availability status
 *                 example: false
 *           example:
 *             available: false
 *     responses:
 *       200:
 *         description: Car availability updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Car availability updated successfully"
 *                 car:
 *                   $ref: '#/components/schemas/Car'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id/availability', carController.updateAvailability);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update car details
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID (MongoDB ObjectId)
 *         example: "65f8e9a1b2c3d4e5f6789012"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *           example:
 *             make: "Toyota"
 *             model: "Camry"
 *             year: 2022
 *             color: "Red"
 *             matricule: "ABC-1234"
 *             dailyRate: 55
 *             available: true
 *             mileage: 12500
 *             fuelType: "Gasoline"
 *             transmission: "Automatic"
 *             imageUrl: "https://example.com/updated-car-image.jpg"
 *     responses:
 *       200:
 *         description: Car updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Car updated successfully"
 *                 car:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', validateRequest(createCarSchema), carController.updateCar);

export default router;
