// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import morgan from 'morgan';
import rentalRoutes from './routes/rental.routes.js';
import carRoutes from './routes/car.routes.js';
import contractTemplateRoutes from './routes/contractTemplate.routes.js';
import authRoutes from './routes/auth.routes.js';
import { specs, swaggerUi } from './config/swagger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import path from 'path';

const app = express();

// Logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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

// CORS - enable credentials for session support
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',') 
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days (1 month)
      sameSite: 'lax',
    },
  })
);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'RentPilot API Documentation',
}));

// API Documentation redirect
app.get('/docs', (req, res) => {
  res.redirect('/api-docs');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/templates', contractTemplateRoutes);

// Handle 404 - undefined routes
app.use(notFound);

// Global error handling middleware (must be last)
app.use(errorHandler);

export default app;
