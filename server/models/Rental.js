import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  client: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    email: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    address: { type: String, required: false },
    nationality: { type: String, required: false },
    clientID: { type: String, required: false },
    licenceNumber: { type: String, required: false },
    clientLicenseIssued: { type: Date, required: false },
  },
  documents: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  departureLocation: { type: String, required: false },
  returnLocation: { type: String, required: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  rentalDuration: { type: Number, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  dailyRate: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  rentalAgreement: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Rental', rentalSchema);
