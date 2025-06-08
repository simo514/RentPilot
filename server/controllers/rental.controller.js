import Rental from '../models/Rental.js';
import Car from '../models/Car.js';

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
        documents // in case documents are sent in body
      } = req.body;

      // Validate daily rate
      if (!dailyRate || dailyRate <= 0) {
        return res.status(400).json({ message: 'Daily rate must be provided and greater than 0' });
      }

      // Find the car
      const car = await Car.findById(carId);
      if (!car) return res.status(404).json({ message: 'Car not found' });
      if (!car.available) return res.status(400).json({ message: 'Car is not available' });

      // Calculate the number of days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const oneDay = 1000 * 60 * 60 * 24;
      const days = Math.ceil((end - start) / oneDay);
      if (days <= 0) return res.status(400).json({ message: 'End date must be after start date' });

      // Calculate the total price
      const totalPrice = days * dailyRate;

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
        documents: req.files
          ? req.files.map(file => ({
              name: file.originalname,
              image: file.path,
              uploadedAt: new Date(),
            }))
          : documents || [], // Use documents from the request body if no files are uploaded
      });

      const savedRental = await rental.save();

      // Mark the car as unavailable
      car.available = false;
      await car.save();

      res.status(201).json(savedRental);
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
  
      res.json({ message: 'Car returned successfully and rental marked as completed' });
    } catch (err) {
      console.error('Error returning car:', err);
      res.status(500).json({ error: err.message });
    }
  }

};

export default rentalController;
