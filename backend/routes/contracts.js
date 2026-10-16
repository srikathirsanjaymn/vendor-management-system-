import express from 'express';
import Contract from '../models/Contract.js';
import Vendor from '../models/Vendor.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }
    if (req.user.role === 'vendor') {
      filter.vendor = req.user.vendor;
    }
    if (req.query.search) {
      filter.$or = [
        { contractId: new RegExp(req.query.search, 'i') },
        { contractTitle: new RegExp(req.query.search, 'i') }
      ];
    }
    const contracts = await Contract.find(filter)
      .populate('vendor', 'vendorName companyName vendorId status')
      .sort({ createdAt: -1 });
    res.json(contracts);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('vendor');
    if (!contract || (req.user.role === 'vendor' && String(contract.vendor._id) !== String(req.user.vendor))) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json(contract);
  } catch (error) {
    next(error);
  }
});

router.post('/', allowRoles('admin'), async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.body.vendor);
    if (!vendor) return res.status(400).json({ message: 'Valid vendor is required' });
    const contract = await Contract.create(req.body);
    res.status(201).json(await contract.populate('vendor', 'vendorName companyName vendorId status'));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', allowRoles('admin'), async (req, res, next) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vendor', 'vendorName companyName vendorId status');
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(contract);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', allowRoles('admin'), async (req, res, next) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true })
      .populate('vendor', 'vendorName companyName vendorId status');
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(contract);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', allowRoles('admin'), async (req, res, next) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json({ message: 'Contract removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
