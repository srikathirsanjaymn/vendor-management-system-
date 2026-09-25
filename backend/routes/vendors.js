import express from 'express';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') filter.status = req.query.status;
    if (req.query.search) filter.$or = [{ vendorName: new RegExp(req.query.search, 'i') }, { companyName: new RegExp(req.query.search, 'i') }, { category: new RegExp(req.query.search, 'i') }];
    const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    const [products, orders] = await Promise.all([
      Product.find({ vendor: vendor._id }).sort({ createdAt: -1 }),
      Order.find({ vendor: vendor._id }).populate('product', 'name').sort({ orderDate: -1 })
    ]);
    res.json({ vendor, products, orders });
  } catch (error) { next(error); }
});

router.post('/', allowRoles('admin'), async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (error) { next(error); }
});

router.put('/:id', allowRoles('admin', 'vendor'), async (req, res, next) => {
  try {
    if (req.user.role === 'vendor' && String(req.user.vendor) !== req.params.id) return res.status(403).json({ message: 'You can only edit your profile' });
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(vendor);
  } catch (error) { next(error); }
});

router.patch('/:id/status', allowRoles('admin'), async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    res.json(vendor);
  } catch (error) { next(error); }
});

router.delete('/:id', allowRoles('admin'), async (req, res, next) => {
  try {
    await Promise.all([Vendor.findByIdAndDelete(req.params.id), User.deleteMany({ vendor: req.params.id }), Product.deleteMany({ vendor: req.params.id }), Order.deleteMany({ vendor: req.params.id })]);
    res.json({ message: 'Vendor removed' });
  } catch (error) { next(error); }
});

export default router;
