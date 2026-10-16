import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect, allowRoles } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role && req.query.role !== 'All') {
      filter.role = req.query.role;
    }
    if (req.query.search) {
      filter.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { email: new RegExp(req.query.search, 'i') }
      ];
    }
    const users = await User.find(filter).populate('vendor', 'vendorName companyName').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post('/', allowRoles('admin'), async (req, res, next) => {
  try {
    const { name, email, password, role, vendor } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'vendor',
      vendor: vendor || null
    });
    res.status(201).json(await User.findById(user._id).populate('vendor', 'vendorName companyName'));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', allowRoles('admin'), async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('vendor', 'vendorName companyName');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', allowRoles('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.email === 'admin@vendom.com') {
      return res.status(400).json({ message: 'Primary demo admin cannot be deleted' });
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
