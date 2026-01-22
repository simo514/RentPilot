// server.js
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from 'express';
import { handleUncaughtException, handleUnhandledRejection } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

// Handle uncaught exceptions (must be at the very top)
handleUncaughtException();

dotenv.config();

const PORT = process.env.PORT || 4000;

// Serve static files from /server/static at /static
app.use(
  '/static',
  express.static(new URL('./static', import.meta.url).pathname)
);

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    logger.info(`🚗 RentPilot server running at http://localhost:${PORT}`);
    console.log(`🚗 RentPilot server running at http://localhost:${PORT}`);
  });

  // Handle unhandled promise rejections
  handleUnhandledRejection();

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM signal received: closing HTTP server');
    server.close(() => {
      logger.info('💥 HTTP server closed');
      process.exit(0);
    });
  });
});
