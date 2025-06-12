import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: { type: String, required: true }, // e.g. Toyota
  model: { type: String, required: true }, // e.g. Corolla
  year: Number, // e.g. 2020
  matricule: { type: String, required: true, unique: true }, // License plate number (must be unique)
  available: { type: Boolean, default: true },
  image: String, // URL to the car image
});

export default mongoose.model('Car', carSchema);
