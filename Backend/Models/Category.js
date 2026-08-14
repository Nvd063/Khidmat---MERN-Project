import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
  },
  icon: {
    type: String, // SVG Icon name ya Image URL
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;