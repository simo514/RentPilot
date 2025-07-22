import express from 'express';
import {
  saveTemplate,
  getTemplates,
} from '../controllers/contractTemplate.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contract Templates
 *   description: Contract template management endpoints
 */

/**
 * @swagger
 * /api/contract-templates:
 *   post:
 *     summary: Save a new contract template
 *     tags: [Contract Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContractTemplate'
 *           example:
 *             name: "Standard Rental Agreement"
 *             template: "<html><head><style>body { font-family: Arial; }</style></head><body><h1>Rental Agreement</h1><p>Client: {{client.firstName}} {{client.lastName}}</p><p>Car: {{car.make}} {{car.model}}</p><p>Start Date: {{startDate}}</p><p>End Date: {{endDate}}</p><p>Total: ${{totalPrice}}</p></body></html>"
 *             isDefault: true
 *     responses:
 *       201:
 *         description: Contract template saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Template saved successfully"
 *                 template:
 *                   $ref: '#/components/schemas/ContractTemplate'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', saveTemplate);

/**
 * @swagger
 * /api/contract-templates:
 *   get:
 *     summary: Get all contract templates
 *     tags: [Contract Templates]
 *     parameters:
 *       - in: query
 *         name: isDefault
 *         schema:
 *           type: boolean
 *         description: Filter by default templates only
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search templates by name
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Templates retrieved successfully"
 *                 templates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContractTemplate'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getTemplates);

export default router;
