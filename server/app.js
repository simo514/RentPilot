// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import rentalRoutes from './routes/rental.routes.js';
import carRoutes from './routes/car.routes.js';
import contractTemplateRoutes from './routes/contractTemplate.routes.js';
import authRoutes from './routes/auth.routes.js';
import { specs, swaggerUi } from './config/swagger.js';
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

// CORS - enable credentials for session support
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
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

export default app;
