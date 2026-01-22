// Middleware to check if user is authenticated
export const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  
  return res.status(401).json({ 
    success: false,
    message: 'Authentication required. Please log in.' 
  });
};
