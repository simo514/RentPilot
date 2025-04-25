import Car from '../models/Car.js';

const carController = {
    // Create a car
    createCar: async (req, res) => {
        try {
            const newCar = new Car(req.body);
            const savedCar = await newCar.save();
            res.status(201).json(savedCar);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Get all cars
    getAllCars: async (req, res) => {
        try {
            const cars = await Car.find();
            res.json(cars);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get car by ID
    getCarById: async (req, res) => {
        try {
            const car = await Car.findById(req.params.id);
            if (!car) return res.status(404).json({ message: 'Car not found' });
            res.json(car);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Delete a car
    deleteCar: async (req, res) => {
        try {
            const deleted = await Car.findByIdAndDelete(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Car not found' });
            res.json({ message: 'Car deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update car availability
    updateAvailability: async (req, res) => {
        try {
            const { available } = req.body;
            const updated = await Car.findByIdAndUpdate(
                req.params.id,
                { available },
                { new: true }
            );
            if (!updated) return res.status(404).json({ message: 'Car not found' });
            res.json(updated);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

export default carController;
