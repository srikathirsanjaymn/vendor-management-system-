import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, trim: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  orderId: { type: String, default: '', trim: true },
  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  paidDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
