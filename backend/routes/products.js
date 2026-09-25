import express from 'express';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) filter.$or = [{ name: new RegExp(req.query.search, 'i') }, { category: new RegExp(req.query.search, 'i') }, { productId: new RegExp(req.query.search, 'i') }];
    if (req.user.role === 'vendor') filter.vendor = req.user.vendor;
    const products = await Product.find(filter).populate('vendor', 'vendorName companyName status').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) { next(error); }
});

router.post('/', allowRoles('admin', 'vendor'), async (req, res, next) => {
  try {
    const vendorId = req.user.role === 'vendor' ? req.user.vendor : req.body.vendor;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(400).json({ message: 'A valid vendor is required' });
    const product = await Product.create({ ...req.body, vendor: vendorId });
    res.status(201).json(await product.populate('vendor', 'vendorName companyName status'));
  } catch (error) { next(error); }
});

router.put('/:id', allowRoles('admin', 'vendor'), async (req, res, next) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing || (req.user.role === 'vendor' && String(existing.vendor) !== String(req.user.vendor))) return res.status(404).json({ message: 'Product not found' });
    const product = await Product.findByIdAndUpdate(req.params.id, { ...req.body, vendor: existing.vendor }, { new: true, runValidators: true }).populate('vendor', 'vendorName companyName status');
    res.json(product);
  } catch (error) { next(error); }
});

router.delete('/:id', allowRoles('admin', 'vendor'), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || (req.user.role === 'vendor' && String(product.vendor) !== String(req.user.vendor))) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) { next(error); }
});

export default router;
