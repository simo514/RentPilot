import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  client: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    email: { type: String, required: false },
  },
  documents: [
    {
      name: { type: String, required: true }, 
      image: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  dailyRate: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  contractPath: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Rental', rentalSchema);
