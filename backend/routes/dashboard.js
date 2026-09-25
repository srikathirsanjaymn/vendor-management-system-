import express from 'express';
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, async (req, res, next) => {
  try {
    const scope = req.user.role === 'vendor' ? { vendor: req.user.vendor } : {};
    const [totalVendors, activeVendors, totalProducts, totalOrders, pendingOrders] = await Promise.all([
      req.user.role === 'vendor' ? Vendor.countDocuments({ _id: req.user.vendor }) : Vendor.countDocuments(),
      req.user.role === 'vendor' ? Vendor.countDocuments({ _id: req.user.vendor, status: 'Active' }) : Vendor.countDocuments({ status: 'Active' }),
      Product.countDocuments(scope), Order.countDocuments(scope), Order.countDocuments({ ...scope, status: 'Pending' })
    ]);
    res.json({ totalVendors, activeVendors, totalProducts, totalOrders, pendingOrders });
  } catch (error) { next(error); }
});
export default router;
