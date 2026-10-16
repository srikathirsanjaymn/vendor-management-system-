import express from 'express';
import Invoice from '../models/Invoice.js';
import Vendor from '../models/Vendor.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.paymentStatus = req.query.status;
    }
    if (req.user.role === 'vendor') {
      filter.vendor = req.user.vendor;
    }
    if (req.query.search) {
      filter.$or = [
        { invoiceNumber: new RegExp(req.query.search, 'i') },
        { orderId: new RegExp(req.query.search, 'i') }
      ];
    }
    const invoices = await Invoice.find(filter)
      .populate('vendor', 'vendorName companyName vendorId status')
      .sort({ dueDate: 1 });
    res.json(invoices);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('vendor');
    if (!invoice || (req.user.role === 'vendor' && String(invoice.vendor._id) !== String(req.user.vendor))) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.post('/', allowRoles('admin'), async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.body.vendor);
    if (!vendor) return res.status(400).json({ message: 'Valid vendor is required' });
    const invoice = await Invoice.create(req.body);
    res.status(201).json(await invoice.populate('vendor', 'vendorName companyName vendorId status'));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', allowRoles('admin'), async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vendor', 'vendorName companyName vendorId status');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', allowRoles('admin'), async (req, res, next) => {
  try {
    const updates = { paymentStatus: req.body.paymentStatus };
    if (req.body.paymentStatus === 'Paid') {
      updates.paidDate = new Date();
    }
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('vendor', 'vendorName companyName vendorId status');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', allowRoles('admin'), async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
