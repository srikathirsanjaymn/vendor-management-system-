import express from 'express';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Contract from '../models/Contract.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      const q = new RegExp(req.query.search, 'i');
      filter.$or = [
        { vendorName: q },
        { companyName: q },
        { category: q },
        { city: q },
        { contactPerson: q },
        { vendorId: q }
      ];
    }
    const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    const [products, orders, contracts] = await Promise.all([
      Product.find({ vendor: vendor._id }).sort({ createdAt: -1 }),
      Order.find({ vendor: vendor._id }).populate('product', 'name productId price').sort({ orderDate: -1 }),
      Contract.find({ vendor: vendor._id }).sort({ endDate: 1 })
    ]);
    res.json({ vendor, products, orders, contracts });
  } catch (error) {
    next(error);
  }
});

router.post('/', allowRoles('admin'), async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', allowRoles('admin', 'vendor'), async (req, res, next) => {
  try {
    if (req.user.role === 'vendor' && String(req.user.vendor) !== req.params.id) {
      return res.status(403).json({ message: 'You can only edit your own profile' });
    }
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(vendor);
  } catch (error) {
    next(error);
  }
});

// Update vendor performance ratings
router.put('/:id/ratings', allowRoles('admin'), async (req, res, next) => {
  try {
    const { quality, delivery, pricing, communication, reliability, compliance } = req.body;
    const ratings = {
      quality: Number(quality) || 4.5,
      delivery: Number(delivery) || 4.5,
      pricing: Number(pricing) || 4.0,
      communication: Number(communication) || 4.5,
      reliability: Number(reliability) || 4.5,
      compliance: Number(compliance) || 4.5
    };
    const overallRating = Number(
      ((ratings.quality + ratings.delivery + ratings.pricing + ratings.communication + ratings.reliability + ratings.compliance) / 6).toFixed(1)
    );
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { ratings, rating: overallRating },
      { new: true, runValidators: true }
    );
    res.json(vendor);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', allowRoles('admin'), async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    res.json(vendor);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', allowRoles('admin'), async (req, res, next) => {
  try {
    await Promise.all([
      Vendor.findByIdAndDelete(req.params.id),
      User.deleteMany({ vendor: req.params.id }),
      Product.deleteMany({ vendor: req.params.id }),
      Order.deleteMany({ vendor: req.params.id }),
      Contract.deleteMany({ vendor: req.params.id })
    ]);
    res.json({ message: 'Vendor removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
