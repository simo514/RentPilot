import ContractTemplate from '../models/ContractTemplate.js';

export const saveTemplate = async (req, res) => {
  try {
    const { name, html } = req.body;
    const template = new ContractTemplate({ name, html });
    await template.save();
    res.status(201).json({ message: 'Template saved.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await ContractTemplate.find();
    res.status(200).json(templates);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Utility function to save a template from a file (for scripts)
export const saveTemplateFromFile = async (name, html) => {
  const template = new ContractTemplate({ name, html });
  await template.save();
  return template;
};