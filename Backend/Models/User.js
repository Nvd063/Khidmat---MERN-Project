import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
  phone: { type: String },
  avatar: { type: String, default: '' },
}, { timestamps: true });

// Check lagayein taakh double compilation error na aaye
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;