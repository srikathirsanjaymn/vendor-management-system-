import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, trim: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Rejected'],
    default: 'Pending'
  },
  orderDate: { type: Date, default: Date.now },
  expectedDelivery: { type: Date }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
