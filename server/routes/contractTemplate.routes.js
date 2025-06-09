import express from 'express';
import { saveTemplate, getTemplates } from '../controllers/contractTemplate.controller.js';

const router = express.Router();

router.post('/', saveTemplate);
router.get('/', getTemplates);

export default router;