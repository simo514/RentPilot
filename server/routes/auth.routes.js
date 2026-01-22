import express from 'express';

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
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate credentials against environment variables
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Set session
    req.session.isAuthenticated = true;
    req.session.user = { username };

    return res.json({
      success: true,
      message: 'Login successful',
      user: { username },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid username or password',
  });
});

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
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to logout',
      });
    }

    res.clearCookie('connect.sid');
    return res.json({
      success: true,
      message: 'Logout successful',
    });
  });
});

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
    return res.json({
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
