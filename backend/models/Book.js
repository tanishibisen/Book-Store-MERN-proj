import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Available', 'Traded'], default: 'Available' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  }
}, { timestamps: true });

// Text index for search
bookSchema.index({ title: 'text', author: 'text' });
// 2dsphere index for geolocation matches
bookSchema.index({ location: '2dsphere' });

export default mongoose.model('Book', bookSchema);
