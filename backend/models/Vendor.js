import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, unique: true, trim: true },
  vendorName: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, default: '' },
  category: { type: String, required: true, trim: true },
  services: [{ type: String, trim: true }],
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  registrationDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Vendor', vendorSchema);
