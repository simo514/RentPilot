import ContractTemplate from '../models/ContractTemplate.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';

export const saveTemplate = catchAsync(async (req, res, next) => {
  const { name, html } = req.body;
  
  if (!name || !html) {
    throw new AppError('Template name and HTML content are required', 400);
  }
  
  const template = new ContractTemplate({ name, html });
  await template.save();
  
  res.status(201).json({
    success: true,
    message: 'Template saved successfully',
    template,
  });
});

export const getTemplates = catchAsync(async (req, res, next) => {
  const templates = await ContractTemplate.find();
  
  res.status(200).json({
    success: true,
    results: templates.length,
    templates,
  });
});

// Utility function to save a template from a file (for scripts)
export const saveTemplateFromFile = async (name, html) => {
  const template = new ContractTemplate({ name, html });
  await template.save();
  return template;
};
