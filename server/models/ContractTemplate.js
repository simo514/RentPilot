import mongoose from 'mongoose';

const contractTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  html: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ContractTemplate', contractTemplateSchema);