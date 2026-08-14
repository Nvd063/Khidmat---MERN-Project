import express from 'express';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';
import { 
  getAdminStats, 
  getAllUsers, 
  getAllProviders, 
  toggleUserStatus, 
  getCategories, 
  createCategory 
} from '../controllers/adminController.js';

const router = express.Router();

// Platform Statistics
router.get('/stats', protect, adminOnly, getAdminStats);

// Users Management
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/status', protect, adminOnly, toggleUserStatus);

// Providers Management
router.get('/providers', protect, adminOnly, getAllProviders);

// Categories Management
router.get('/categories', protect, adminOnly, getCategories);
router.post('/categories', protect, adminOnly, createCategory);

export default router;