// server.js
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from 'express';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Serve static files from /server/static at /static
app.use(
  '/static',
  express.static(new URL('./static', import.meta.url).pathname)
);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚗 RentPilot server running at http://localhost:${PORT}`);
  });
});
