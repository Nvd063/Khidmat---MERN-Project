import ServiceRequest from '../models/ServiceRequest.js';
import ProviderProfile from '../models/ProviderProfile.js';

// 1. Get all service providers
export const getProviders = async (req, res) => {
  try {
    const providers = await ProviderProfile.find().populate('user', 'name email phone');
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Create or update provider profile
export const updateProviderProfile = async (req, res) => {
  try {
    const { category, serviceAreas, bio } = req.body;
    const userId = req.user.id;

    let profile = await ProviderProfile.findOne({ user: userId });

    if (profile) {
      profile.category = category || profile.category;
      profile.serviceAreas = serviceAreas || profile.serviceAreas;
      profile.bio = bio || profile.bio;
      await profile.save();
    } else {
      profile = await ProviderProfile.create({
        user: userId,
        category,
        serviceAreas,
        bio
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Create a new service request
export const createServiceRequest = async (req, res) => {
  try {
    const { providerId, serviceName, bookingDate, notes } = req.body;

    const newRequest = await ServiceRequest.create({
      customer: req.user.id,
      provider: providerId,
      serviceName,
      bookingDate,
      notes
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Update request status (accept / reject / complete)
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Get User or Provider Specific Requests
export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = userRole === 'provider' ? { provider: userId } : { customer: userId };

    const requests = await ServiceRequest.find(query)
      .populate('customer', 'name email phone')
      .populate('provider', 'name email phone');

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};