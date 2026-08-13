import mongoose from 'mongoose';

const providerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  servicesOffered: [{ name: String, price: Number }],
  serviceAreas: [String],
  portfolioImages: [String],
  bio: { type: String },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('ProviderProfile', providerProfileSchema);