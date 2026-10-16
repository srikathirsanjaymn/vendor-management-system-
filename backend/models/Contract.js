import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  contractId: { type: String, required: true, unique: true, trim: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  contractTitle: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  contractValue: { type: Number, required: true, min: 0 },
  paymentTerms: { type: String, default: 'Net 30', trim: true },
  status: {
    type: String,
    enum: ['Active', 'Expiring Soon', 'Expired', 'Draft', 'Terminated'],
    default: 'Active'
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Contract', contractSchema);
