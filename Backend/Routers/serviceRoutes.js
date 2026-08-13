import express from 'express';
import { 
  getProviders, 
  updateProviderProfile, 
  createServiceRequest, 
  updateRequestStatus, 
  getMyRequests 
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/providers', getProviders);
router.post('/provider-profile', protect, updateProviderProfile);
router.post('/request', protect, createServiceRequest);
router.put('/request/:requestId', protect, updateRequestStatus);
router.get('/requests', protect, getMyRequests);

export default router;