import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const filter = req.user.role === 'vendor' ? { vendor: req.user.vendor } : {};
    if (req.query.status && req.query.status !== 'All') filter.status = req.query.status;
    if (req.query.search) filter.orderId = new RegExp(req.query.search, 'i');
    res.json(await Order.find(filter).populate('vendor', 'vendorName companyName status').populate('product', 'name productId price').sort({ orderDate: -1 }));
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('vendor').populate('product');
    if (!order || (req.user.role === 'vendor' && String(order.vendor._id) !== String(req.user.vendor))) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) { next(error); }
});

router.post('/', allowRoles('admin'), async (req, res, next) => {
  try {
    const { product, quantity } = req.body;
    const selectedProduct = await Product.findById(product).populate('vendor');
    if (!selectedProduct || selectedProduct.vendor.status !== 'Active') return res.status(400).json({ message: 'This vendor is inactive or the product is unavailable' });
    if (selectedProduct.quantity < quantity) return res.status(400).json({ message: 'Requested quantity is not available' });
    const order = await Order.create({ ...req.body, vendor: selectedProduct.vendor._id, totalAmount: selectedProduct.price * quantity, orderId: req.body.orderId || `ORD-${Date.now()}` });
    selectedProduct.quantity -= quantity;
    await selectedProduct.save();
    res.status(201).json(await order.populate([{ path: 'vendor', select: 'vendorName companyName status' }, { path: 'product', select: 'name productId price' }]));
  } catch (error) { next(error); }
});

router.patch('/:id/status', allowRoles('admin', 'vendor'), async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || (req.user.role === 'vendor' && String(order.vendor) !== String(req.user.vendor))) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json(await order.populate([{ path: 'vendor', select: 'vendorName companyName status' }, { path: 'product', select: 'name productId price' }]));
  } catch (error) { next(error); }
});

export default router;
