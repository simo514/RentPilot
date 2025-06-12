import Rental from '../models/Rental.js';
import Car from '../models/Car.js';
import uploadImage from '../services/uploadImage.js';

const rentalController = {
  // 1. Create a new rental
  createRental: async (req, res) => {
    try {
      const {
        client,
        carId,
        startDate,
        endDate,
        dailyRate,
        departureLocation,
        returnLocation,
        rentalAgreement,
        documents,
        totalPrice,
        rentalDuration,
        createdAt, // in case documents are sent in body
      } = req.body;

      // Validate daily rate
      if (!dailyRate || dailyRate <= 0) {
        return res
          .status(400)
          .json({ message: 'Daily rate must be provided and greater than 0' });
      }

      // Find the car
      const car = await Car.findById(carId);
      if (!car) return res.status(404).json({ message: 'Car not found' });
      if (!car.available)
        return res.status(400).json({ message: 'Car is not available' });

      // Calculate the number of days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const oneDay = 1000 * 60 * 60 * 24;
      const days = Math.ceil((end - start) / oneDay);
      if (days <= 0)
        return res
          .status(400)
          .json({ message: 'End date must be after start date' });

      // Handle document uploads to Cloudinary (base64 only)
      let rentalDocuments = [];
      if (documents && Array.isArray(documents)) {
        rentalDocuments = await Promise.all(
          documents.map(async (doc) => ({
            name: doc.name,
            image: await uploadImage(doc.image),
            uploadedAt: new Date(),
          }))
        );
      }

      // Create the rental
      const rental = new Rental({
        client,
        car: car._id,
        startDate: start,
        endDate: end,
        dailyRate,
        totalPrice,
        departureLocation,
        returnLocation,
        rentalAgreement,
        rentalDuration,
        createdAt,
        documents: rentalDocuments,
      });

      const savedRental = await rental.save();

      // Mark the car as unavailable
      car.available = false;
      await car.save();

      res.status(201).json({
        message: 'Rental created successfully',
        rental: savedRental,
      });
    } catch (err) {
      console.error('Error creating rental:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 2. Get all rentals
  getAllRentals: async (req, res) => {
    try {
      const rentals = await Rental.find().populate('car');
      res.json(rentals);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 3. Get rental by ID
  getRentalById: async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id).populate('car');
      if (!rental) return res.status(404).json({ message: 'Rental not found' });
      res.json(rental);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 4. Return a rental (mark car as available again)
  returnRental: async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id);
      if (!rental) return res.status(404).json({ message: 'Rental not found' });

      // Find the car
      const car = await Car.findById(rental.car);
      if (!car) return res.status(404).json({ message: 'Car not found' });

      // Mark the car as available again
      car.available = true;
      await car.save();

      // Update rental status to 'Completed'
      rental.status = 'completed';
      await rental.save();

      res.json({
        message: 'Car returned successfully and rental marked as completed',
      });
    } catch (err) {
      console.error('Error returning car:', err);
      res.status(500).json({ error: err.message });
    }
  },
  // 5. Delete a rental
  deleteRental: async (req, res) => {
    try {
      const rental = await Rental.findByIdAndDelete(req.params.id);
      if (!rental) return res.status(404).json({ message: 'Rental not found' });
      res.json({ message: 'Rental deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default rentalController;
