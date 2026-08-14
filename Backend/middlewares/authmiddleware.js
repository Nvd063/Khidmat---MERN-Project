import jwt from 'jsonwebtoken';
import User from '../Models/User.js'; // Adjust path according to your structure

// 1. Single Protection Middleware (Validates Token & Loads Full User)
export const protect = async (req, res, next) => {
  let token;

  // Single standard secret key across entire app
  const secretKey = process.env.JWT_SECRET || 'mysecretkey123.env';

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, secretKey);

      // Fetch user from DB (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User belonging to this token no longer exists' 
        });
      }

      return next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      return res.status(401).json({ 
        success: false, 
        message: `Not authorized: ${error.message}` 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided' 
    });
  }
};

// 2. Admin Only Middleware (Requires 'protect' to be executed first)
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'Admin')) {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Access denied: Admin access required' 
  });
};