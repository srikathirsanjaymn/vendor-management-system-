import express from 'express';
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Contract from '../models/Contract.js';
import Invoice from '../models/Invoice.js';
import Activity from '../models/Activity.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { seedAllData } from '../seed.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const scope = req.user.role === 'vendor' ? { vendor: req.user.vendor } : {};

    // 1. Calculate Vendors Stats
    const [
      totalVendors,
      activeVendors,
      pendingVendors,
      suspendedVendors,
      inactiveVendors
    ] = await Promise.all([
      req.user.role === 'vendor' ? Vendor.countDocuments({ _id: req.user.vendor }) : Vendor.countDocuments(),
      req.user.role === 'vendor' ? Vendor.countDocuments({ _id: req.user.vendor, status: 'Active' }) : Vendor.countDocuments({ status: 'Active' }),
      req.user.role === 'vendor' ? Vendor.countDocuments({ _id: req.user.vendor, status: 'Pending' }) : Vendor.countDocuments({ status: 'Pending' }),
      req.user.role === 'vendor' ? Vendor.countDocuments({ _id: req.user.vendor, status: 'Suspended' }) : Vendor.countDocuments({ status: 'Suspended' }),
      req.user.role === 'vendor' ? Vendor.countDocuments({ _id: req.user.vendor, status: 'Inactive' }) : Vendor.countDocuments({ status: 'Inactive' })
    ]);

    // 2. Calculate Contracts Stats
    const [
      totalContracts,
      activeContracts,
      expiringSoonContracts,
      expiredContracts,
      draftContracts
    ] = await Promise.all([
      Contract.countDocuments(scope),
      Contract.countDocuments({ ...scope, status: 'Active' }),
      Contract.countDocuments({ ...scope, status: 'Expiring Soon' }),
      Contract.countDocuments({ ...scope, status: 'Expired' }),
      Contract.countDocuments({ ...scope, status: 'Draft' })
    ]);

    // 3. Calculate Orders Stats
    const [
      totalOrders,
      pendingOrders,
      approvedOrders,
      deliveredOrders,
      cancelledOrders,
      rejectedOrders,
      totalProducts
    ] = await Promise.all([
      Order.countDocuments(scope),
      Order.countDocuments({ ...scope, status: 'Pending' }),
      Order.countDocuments({ ...scope, status: { $in: ['Approved', 'Processing', 'Shipped'] } }),
      Order.countDocuments({ ...scope, status: 'Delivered' }),
      Order.countDocuments({ ...scope, status: 'Cancelled' }),
      Order.countDocuments({ ...scope, status: 'Rejected' }),
      Product.countDocuments(scope)
    ]);

    // 4. Calculate Invoices Stats
    const [
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      rejectedInvoices
    ] = await Promise.all([
      Invoice.countDocuments(scope),
      Invoice.countDocuments({ ...scope, paymentStatus: 'Paid' }),
      Invoice.countDocuments({ ...scope, paymentStatus: 'Pending' }),
      Invoice.countDocuments({ ...scope, paymentStatus: 'Overdue' }),
      Invoice.countDocuments({ ...scope, paymentStatus: 'Rejected' })
    ]);

    // 5. Vendor Distribution by Category
    const categoryAgg = await Vendor.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const vendorDistribution = categoryAgg.map(item => ({
      category: item._id,
      count: item.count
    }));

    // 6. Purchase Order Monthly Trend
    const monthlyTrend = [
      { month: 'Jan', amount: 120000, formatted: '₹1.2L', ordersCount: 4 },
      { month: 'Feb', amount: 150000, formatted: '₹1.5L', ordersCount: 5 },
      { month: 'Mar', amount: 110000, formatted: '₹1.1L', ordersCount: 3 },
      { month: 'Apr', amount: 180000, formatted: '₹1.8L', ordersCount: 6 },
      { month: 'May', amount: 210000, formatted: '₹2.1L', ordersCount: 7 },
      { month: 'Jun', amount: 170000, formatted: '₹1.7L', ordersCount: 5 },
      { month: 'Jul', amount: 240000, formatted: '₹2.4L', ordersCount: 8 },
      { month: 'Aug', amount: 200000, formatted: '₹2.0L', ordersCount: 6 },
      { month: 'Sep', amount: 270000, formatted: '₹2.7L', ordersCount: 9 }
    ];

    // 7. Recent Activities
    const recentActivities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(6);

    res.json({
      vendors: {
        total: totalVendors,
        active: activeVendors,
        pending: pendingVendors,
        suspended: suspendedVendors,
        inactive: inactiveVendors
      },
      contracts: {
        total: totalContracts,
        active: activeContracts,
        expiringSoon: expiringSoonContracts,
        expired: expiredContracts,
        draft: draftContracts
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        approved: approvedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        rejected: rejectedOrders
      },
      invoices: {
        total: totalInvoices,
        paid: paidInvoices,
        pending: pendingInvoices,
        overdue: overdueInvoices,
        rejected: rejectedInvoices
      },
      totalProducts,
      vendorDistribution,
      monthlyTrend,
      recentActivities,
      // Backward compatibility fields for legacy frontend callers
      totalVendors,
      activeVendors,
      totalOrders,
      pendingOrders
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint to reset and re-seed demo data directly from frontend Settings
router.post('/reset-demo', allowRoles('admin'), async (_req, res, next) => {
  try {
    const summary = await seedAllData();
    res.json({ message: 'Demo data has been reset to baseline successfully', summary });
  } catch (error) {
    next(error);
  }
});

export default router;
