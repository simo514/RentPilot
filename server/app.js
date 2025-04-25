// app.js
import express from 'express';
import cors from 'cors';
import rentalRoutes from './routes/rental.routes.js';
import carRoutes from './routes/car.routes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/rentals', rentalRoutes);
app.use('/api/cars', carRoutes);


export default app;
