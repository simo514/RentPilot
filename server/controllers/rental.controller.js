import Rental from '../models/Rental.js';
import Car from '../models/Car.js';
import uploadImage from '../services/uploadImage.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';

const rentalController = {
  // 1. Create a new rental
  createRental: catchAsync(async (req, res, next) => {
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
      createdAt,
    } = req.body;

    // Validate daily rate
    if (!dailyRate || dailyRate <= 0) {
      throw new AppError('Daily rate must be provided and greater than 0', 400);
    }

    // Find the car
    const car = await Car.findById(carId);
    if (!car) {
      throw new AppError('Car not found', 404);
    }
    if (!car.available) {
      throw new AppError('Car is not available for rental', 400);
    }

    // Calculate the number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil((end - start) / oneDay);
    
    if (days <= 0) {
      throw new AppError('End date must be after start date', 400);
    }

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
      success: true,
      message: 'Rental created successfully',
      rental: savedRental,
    });
  }),

  // 2. Get all rentals (with optional limit and sort)
  getAllRentals: catchAsync(async (req, res, next) => {
    const { limit, sort = '-createdAt' } = req.query;
    
    let query = Rental.find().populate('car');
    
    // Apply sorting (default: newest first)
    query = query.sort(sort);
    
    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const rentals = await query;
    
    res.status(200).json({
      success: true,
      results: rentals.length,
      rentals,
    });
  }),

  // 3. Get rental by ID
  getRentalById: catchAsync(async (req, res, next) => {
    const rental = await Rental.findById(req.params.id).populate('car');
    
    if (!rental) {
      throw new AppError('Rental not found', 404);
    }
    
    res.status(200).json({
      success: true,
      rental,
    });
  }),

  // 4. Return a rental (mark car as available again)
  returnRental: catchAsync(async (req, res, next) => {
    const rental = await Rental.findById(req.params.id);
    
    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    // Find the car
    const car = await Car.findById(rental.car);
    if (!car) {
      throw new AppError('Car not found', 404);
    }

    // Mark the car as available again
    car.available = true;
    await car.save();

    // Update rental status to 'Completed'
    rental.status = 'completed';
    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Car returned successfully and rental marked as completed',
    });
  }),

  // 5. Delete a rental
  deleteRental: catchAsync(async (req, res, next) => {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    
    if (!rental) {
      throw new AppError('Rental not found', 404);
    }
    
    res.status(200).json({
      success: true,
      message: 'Rental deleted successfully',
    });
  }),
};

export default rentalController;
