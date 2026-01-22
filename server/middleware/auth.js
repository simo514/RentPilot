// Middleware to check if user is authenticated
export const requireAuth = (req, res, next) => {
  console.log('🔐 Auth check - Session:', req.session);
  console.log('🔐 Session ID:', req.sessionID);
  console.log('🔐 Cookies:', req.headers.cookie);
  
  if (req.session && req.session.isAuthenticated) {
    console.log('✅ User authenticated');
    return next();
  }
  
  console.log('❌ User not authenticated');
  return res.status(401).json({ 
    success: false,
    message: 'Authentication required. Please log in.' 
  });
};
