import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from './routes/auth.js';
import vendorRoutes from './routes/vendors.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import dashboardRoutes from './routes/dashboard.js';
import contractRoutes from './routes/contracts.js';
import invoiceRoutes from './routes/invoices.js';
import activityRoutes from './routes/activities.js';
import userRoutes from './routes/users.js';
import Vendor from './models/Vendor.js';
import { seedAllData } from './seed.js';

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((item) => item.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) ||
      origin.endsWith('.vercel.app') ||
      (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', demoMode: true }));
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../frontend/dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  if (error.code === 11000) return res.status(409).json({ message: 'A record with that ID or email already exists' });
  if (error.name === 'ValidationError') return res.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(', ') });
  console.error(error);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

async function ensureDemoData() {
  try {
    const vendorCount = await Vendor.countDocuments();
    if (vendorCount < 15) {
      console.log(`Current vendor count (${vendorCount}) is below target. Seeding full demo dataset...`);
      await seedAllData();
      console.log('Demo database seeded successfully.');
    } else {
      console.log(`Database already populated with ${vendorCount} vendors.`);
    }
  } catch (err) {
    console.error('Error during demo data check:', err);
  }
}

const port = process.env.PORT || 5000;

async function connectToDatabase() {
  const configuredUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vendor-management';

  try {
    await mongoose.connect(configuredUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`Connected to MongoDB at ${configuredUri}`);
  } catch (error) {
    console.warn('Configured MongoDB is unavailable. Starting in-memory MongoDB fallback for local demonstration.');
    const memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log('Connected to in-memory MongoDB instance.');
  }
}

connectToDatabase()
  .then(async () => {
    await ensureDemoData();
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
