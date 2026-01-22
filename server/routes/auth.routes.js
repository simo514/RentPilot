import express from 'express';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    throw new AppError('Please provide username and password', 400);
  }

  // Validate credentials against environment variables
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Set session
    req.session.isAuthenticated = true;
    req.session.user = { username };

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { username },
    });
  }

  throw new AppError('Invalid username or password', 401);
}));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout from the application
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', catchAsync(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      throw new AppError('Failed to logout. Please try again.', 500);
    }

    res.clearCookie('connect.sid');
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });
}));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Check authentication status
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: User is not authenticated
 */
router.get('/me', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.status(200).json({
      success: true,
      isAuthenticated: true,
      user: req.session.user,
    });
  }

  return res.status(401).json({
    success: false,
    isAuthenticated: false,
  });
});

export default router;
