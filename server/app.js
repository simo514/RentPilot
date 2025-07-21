// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import rentalRoutes from './routes/rental.routes.js';
import carRoutes from './routes/car.routes.js';
import contractTemplateRoutes from './routes/contractTemplate.routes.js';
import path from 'path';

const app = express();

app.use('/static', express.static(path.join(process.cwd(), 'uploads')));

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now since you're using inline HTML
}));

// Rate limiting - allows 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/rentals', rentalRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/templates', contractTemplateRoutes);

export default app;
