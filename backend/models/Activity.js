import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  type: {
    type: String,
    enum: ['vendor', 'order', 'invoice', 'contract', 'rating', 'system'],
    default: 'system'
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
