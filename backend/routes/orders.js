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
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      filter.orderId = new RegExp(req.query.search, 'i');
    }
    const orders = await Order.find(filter)
      .populate('vendor', 'vendorName companyName vendorId status')
      .populate('product', 'name productId price category')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('vendor')
      .populate('product');
    if (!order || (req.user.role === 'vendor' && String(order.vendor._id) !== String(req.user.vendor))) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
});

router.post('/', allowRoles('admin'), async (req, res, next) => {
  try {
    const { product, quantity, expectedDelivery, orderId } = req.body;
    const selectedProduct = await Product.findById(product).populate('vendor');
    if (!selectedProduct) {
      return res.status(400).json({ message: 'Product not found' });
    }
    if (selectedProduct.vendor.status !== 'Active') {
      return res.status(400).json({ message: 'Cannot order from an inactive or suspended vendor' });
    }
    if (selectedProduct.quantity < Number(quantity)) {
      return res.status(400).json({ message: `Only ${selectedProduct.quantity} items available in stock` });
    }

    const unitPrice = selectedProduct.price;
    const totalAmount = unitPrice * Number(quantity);
    const count = await Order.countDocuments();
    const finalOrderId = orderId || `PO-${1000 + count + 1}`;

    const order = await Order.create({
      orderId: finalOrderId,
      vendor: selectedProduct.vendor._id,
      product: selectedProduct._id,
      quantity: Number(quantity),
      unitPrice,
      totalAmount,
      status: req.body.status || 'Pending',
      orderDate: req.body.orderDate || new Date(),
      expectedDelivery: expectedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    selectedProduct.quantity -= Number(quantity);
    await selectedProduct.save();

    res.status(201).json(await order.populate([
      { path: 'vendor', select: 'vendorName companyName vendorId status' },
      { path: 'product', select: 'name productId price category' }
    ]));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', allowRoles('admin', 'vendor'), async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || (req.user.role === 'vendor' && String(order.vendor) !== String(req.user.vendor))) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = req.body.status;
    await order.save();
    res.json(await order.populate([
      { path: 'vendor', select: 'vendorName companyName vendorId status' },
      { path: 'product', select: 'name productId price category' }
    ]));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', allowRoles('admin'), async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
