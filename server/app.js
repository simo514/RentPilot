// app.js
import express from 'express';
import cors from 'cors';
import rentalRoutes from './routes/rental.routes.js';
import carRoutes from './routes/car.routes.js';
import contractTemplateRoutes from './routes/contractTemplate.routes.js';
import path from 'path';

const app = express();

app.use('/static', express.static(path.join(process.cwd(), 'uploads')));


app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/rentals', rentalRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/templates', contractTemplateRoutes);


export default app;
