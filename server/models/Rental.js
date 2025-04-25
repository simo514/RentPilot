import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  client: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    email: String
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  contractPath: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Rental', rentalSchema);
