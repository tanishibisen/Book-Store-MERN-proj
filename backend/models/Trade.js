import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  offeredBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Trade', tradeSchema);
