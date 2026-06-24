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
      totalPrice,
      rentalDuration,
      createdAt,
    } = JSON.parse(req.body.data);

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

    // Upload document images from multipart files to Cloudinary
    let rentalDocuments = [];
    if (req.files) {
      const fileMap = [
        { key: 'driverLicense', name: 'Driver License' },
        { key: 'idCard', name: 'ID Card' },
      ];
      rentalDocuments = await Promise.all(
        fileMap
          .filter(({ key }) => req.files[key]?.[0])
          .map(async ({ key, name }) => ({
            name,
            image: await uploadImage(req.files[key][0].buffer),
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
    const { limit, sort = '-createdAt', month, year } = req.query;
    
    let filter = {};
    
    // Apply month/year filter if provided
    if (month !== undefined && year !== undefined) {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      const startDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(yearNum, monthNum + 1, 1, 0, 0, 0, 0));
      
      filter = {
        startDate: {
          $gte: startDate,
          $lt: endDate
        }
      };
    }
    
    let query = Rental.find(filter)
     .populate('car', 'make model matricule')
     .select('client.firstName client.lastName car startDate endDate status _id'); 

    
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
    const rental = await Rental.findById(req.params.id).populate('car', '-image');
    
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
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    const car = await Car.findById(rental.car);
    if (car && !car.available) {
      throw new AppError('Cannot delete an active rental while the car is unavailable', 400);
    }

    await Rental.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Rental deleted successfully',
    });
  }),
};

export default rentalController;
