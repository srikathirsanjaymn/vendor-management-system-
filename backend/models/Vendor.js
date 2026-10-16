import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, unique: true, trim: true },
  vendorName: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  contactPerson: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  gstNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  category: { type: String, required: true, trim: true },
  services: [{ type: String, trim: true }],
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Suspended', 'Inactive'],
    default: 'Active'
  },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  ratings: {
    quality: { type: Number, default: 4.5 },
    delivery: { type: Number, default: 4.5 },
    pricing: { type: Number, default: 4.0 },
    communication: { type: Number, default: 4.5 },
    reliability: { type: Number, default: 4.5 },
    compliance: { type: Number, default: 4.5 }
  },
  registrationDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Vendor', vendorSchema);
