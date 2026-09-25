import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.js';
import vendorRoutes from './routes/vendors.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import dashboardRoutes from './routes/dashboard.js';
import User from './models/User.js';
import Vendor from './models/Vendor.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use((error, _req, res, _next) => {
  if (error.code === 11000) return res.status(409).json({ message: 'A record with that ID or email already exists' });
  if (error.name === 'ValidationError') return res.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(', ') });
  console.error(error);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

async function seedAdmin() {
  if (await User.exists({ email: 'admin@vendom.com' })) return;
  const vendor = await Vendor.create({ vendorId: 'VND-001', vendorName: 'Northstar Supplies', companyName: 'Northstar Supplies Ltd.', email: 'hello@northstar.test', phone: '+1 555 0100', address: '18 Market Street', category: 'Office Supplies', services: ['Stationery', 'Bulk procurement'] });
  await User.create({ name: 'System Admin', email: 'admin@vendom.com', password: await bcrypt.hash('admin123', 10), role: 'admin' });
  await User.create({ name: vendor.vendorName, email: 'vendor@northstar.test', password: await bcrypt.hash('vendor123', 10), role: 'vendor', vendor: vendor._id });
  console.log('Seeded demo users: admin@vendom.com / admin123 and vendor@northstar.test / vendor123');
}

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vendor-management')
  .then(async () => { await seedAdmin(); app.listen(port, () => console.log(`API listening on http://localhost:${port}`)); })
  .catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
