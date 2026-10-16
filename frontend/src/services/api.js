import { demoStore } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function handleMockRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const cleanPath = path.split('?')[0];

  if (cleanPath === '/auth/login' && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    // 1. Vendor Demo Accounts
    if (
      email === 'vendor@northstar.test' ||
      email === 'vendor@northstar.com' ||
      email === 'vendor@vendom.com' ||
      email === 'vendor' ||
      (email.includes('vendor') && (password === 'vendor123' || password === 'vendor' || password === '123' || password === 'admin123'))
    ) {
      const vendorUser = demoStore.users?.find((u) => u.email === 'vendor@northstar.test') || {
        _id: 'usr-vnd-001',
        id: 'usr-vnd-001',
        name: 'Rajesh Raman',
        email: email || 'vendor@northstar.test',
        role: 'vendor',
        vendor: {
          _id: 'vnd-001',
          vendorId: 'VND-001',
          vendorName: 'Northstar Supplies',
          companyName: 'Northstar Supplies Ltd.'
        }
      };
      demoStore.currentUser = vendorUser;
      return {
        token: 'demo-jwt-vendor-token',
        user: vendorUser
      };
    }

    if (email === 'tech@bluepeak.test' || email === 'tech@bluepeak.com' || email.includes('bluepeak')) {
      const vendorUser = demoStore.users?.find((u) => u.email === 'tech@bluepeak.test') || {
        _id: 'usr-vnd-002',
        id: 'usr-vnd-002',
        name: 'Ananya Sharma',
        email,
        role: 'vendor',
        vendor: {
          _id: 'vnd-002',
          vendorId: 'VND-002',
          vendorName: 'BluePeak Technologies',
          companyName: 'BluePeak Technologies Pvt Ltd'
        }
      };
      demoStore.currentUser = vendorUser;
      return {
        token: 'demo-jwt-vendor-token',
        user: vendorUser
      };
    }

    if (email === 'dispatch@vertex.test' || email === 'dispatch@vertex.com' || email.includes('vertex')) {
      const vendorUser = demoStore.users?.find((u) => u.email === 'dispatch@vertex.test') || {
        _id: 'usr-vnd-003',
        id: 'usr-vnd-003',
        name: 'Vikram Mehta',
        email,
        role: 'vendor',
        vendor: {
          _id: 'vnd-004',
          vendorId: 'VND-004',
          vendorName: 'Vertex Logistics',
          companyName: 'Vertex Logistics Corp'
        }
      };
      demoStore.currentUser = vendorUser;
      return {
        token: 'demo-jwt-vendor-token',
        user: vendorUser
      };
    }

    // 2. Admin Demo Accounts
    if (
      email === 'admin@vendom.com' ||
      email === 'admin@123' ||
      email === 'admin' ||
      (email.includes('admin') && (password === 'admin123' || password === 'admin' || password === '123' || password === 'admin@123'))
    ) {
      demoStore.currentUser = {
        id: 'usr-admin-demo',
        name: 'Kathir Sanjay',
        email: email || 'admin@vendom.com',
        role: 'admin'
      };
      return {
        token: 'demo-jwt-token-active',
        user: demoStore.currentUser
      };
    }

    if (password === 'admin123' || password === 'vendor123' || !password) {
      const isVendor = email.includes('vendor') || password === 'vendor123';
      const role = isVendor ? 'vendor' : 'admin';
      const user = {
        id: isVendor ? 'usr-vnd-001' : 'usr-admin-demo',
        name: isVendor ? 'Rajesh Raman' : 'Kathir Sanjay',
        email,
        role,
        ...(isVendor
          ? {
              vendor: {
                _id: 'vnd-001',
                vendorId: 'VND-001',
                vendorName: 'Northstar Supplies',
                companyName: 'Northstar Supplies Ltd.'
              }
            }
          : {})
      };
      demoStore.currentUser = user;
      return {
        token: 'demo-jwt-token-active',
        user
      };
    }

    throw new Error('Invalid email or password. Use demo login: admin@vendom.com / admin123 or vendor@northstar.test / vendor123');
  }

  if (cleanPath === '/auth/me') {
    return { user: demoStore.currentUser };
  }

  if (cleanPath === '/dashboard') {
    return {
      vendors: {
        total: demoStore.vendors.length,
        active: demoStore.vendors.filter((v) => v.status === 'Active').length,
        pending: demoStore.vendors.filter((v) => v.status === 'Pending').length,
        suspended: demoStore.vendors.filter((v) => v.status === 'Suspended').length,
        inactive: demoStore.vendors.filter((v) => v.status === 'Inactive').length
      },
      contracts: {
        total: demoStore.contracts.length,
        active: demoStore.contracts.filter((c) => c.status === 'Active').length,
        expiringSoon: demoStore.contracts.filter((c) => c.status === 'Expiring Soon').length,
        expired: demoStore.contracts.filter((c) => c.status === 'Expired').length,
        draft: demoStore.contracts.filter((c) => c.status === 'Draft').length
      },
      orders: {
        total: demoStore.orders.length,
        pending: demoStore.orders.filter((o) => o.status === 'Pending').length,
        approved: demoStore.orders.filter((o) => o.status === 'Approved').length,
        delivered: demoStore.orders.filter((o) => o.status === 'Delivered').length,
        cancelled: demoStore.orders.filter((o) => o.status === 'Cancelled').length
      },
      invoices: {
        total: demoStore.invoices.length,
        paid: demoStore.invoices.filter((i) => i.status === 'Paid').length,
        pending: demoStore.invoices.filter((i) => i.status === 'Pending').length,
        overdue: demoStore.invoices.filter((i) => i.status === 'Overdue').length
      },
      monthlyTrend: [
        { month: 'Jan', amount: 120000, formatted: '₹1.2L' },
        { month: 'Feb', amount: 150000, formatted: '₹1.5L' },
        { month: 'Mar', amount: 110000, formatted: '₹1.1L' },
        { month: 'Apr', amount: 180000, formatted: '₹1.8L' },
        { month: 'May', amount: 210000, formatted: '₹2.1L' },
        { month: 'Jun', amount: 170000, formatted: '₹1.7L' },
        { month: 'Jul', amount: 240000, formatted: '₹2.4L' },
        { month: 'Aug', amount: 200000, formatted: '₹2.0L' },
        { month: 'Sep', amount: 280000, formatted: '₹2.8L' },
        { month: 'Oct', amount: 320000, formatted: '₹3.2L' },
        { month: 'Nov', amount: 290000, formatted: '₹2.9L' },
        { month: 'Dec', amount: 350000, formatted: '₹3.5L' }
      ],
      recentActivities: demoStore.activities
    };
  }

  if (cleanPath === '/vendors') {
    if (method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const newV = {
        _id: 'vnd-' + Date.now(),
        vendorId: `VND-0${demoStore.vendors.length + 1}`,
        rating: 4.5,
        registrationDate: new Date().toISOString().slice(0, 10),
        ...body
      };
      demoStore.vendors.unshift(newV);
      return newV;
    }
    return demoStore.vendors;
  }

  if (cleanPath.startsWith('/vendors/')) {
    const id = cleanPath.split('/')[2];
    if (method === 'DELETE') {
      demoStore.vendors = demoStore.vendors.filter((v) => v._id !== id && v.vendorId !== id);
      return { success: true };
    }
    const idx = demoStore.vendors.findIndex((v) => v._id === id || v.vendorId === id);
    if (idx !== -1 && (method === 'PUT' || method === 'PATCH')) {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      demoStore.vendors[idx] = { ...demoStore.vendors[idx], ...body };
      return demoStore.vendors[idx];
    }
    return demoStore.vendors.find((v) => v._id === id || v.vendorId === id) || demoStore.vendors[0];
  }

  if (cleanPath === '/contracts') {
    if (method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const newC = {
        _id: 'cnt-' + Date.now(),
        contractNumber: `CNT-2026-00${demoStore.contracts.length + 1}`,
        slaScore: 95,
        ...body
      };
      demoStore.contracts.unshift(newC);
      return newC;
    }
    return demoStore.contracts;
  }

  if (cleanPath === '/orders') {
    if (method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const newO = {
        _id: 'ord-' + Date.now(),
        orderNumber: `PO-2026-00${demoStore.orders.length + 1}`,
        orderDate: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        ...body
      };
      demoStore.orders.unshift(newO);
      return newO;
    }
    return demoStore.orders;
  }

  if (cleanPath === '/invoices') {
    if (method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const amt = Number(body.amount) || 0;
      const tax = Math.round(amt * 0.18);
      const newI = {
        _id: 'inv-' + Date.now(),
        invoiceNumber: body.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: amt,
        tax,
        total: amt + tax,
        paymentStatus: body.paymentStatus || 'Pending',
        status: body.paymentStatus || 'Pending',
        invoiceDate: body.invoiceDate || new Date().toISOString().slice(0, 10),
        dueDate: body.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
        paymentMethod: body.paymentMethod || 'NEFT / Bank Transfer',
        notes: body.notes || 'Vendor procurement milestone payment',
        ...body
      };
      demoStore.invoices.unshift(newI);
      return newI;
    }
    const params = new URLSearchParams(path.split('?')[1] || '');
    const search = (params.get('search') || '').toLowerCase();
    const status = params.get('status');
    let res = [...demoStore.invoices];
    if (search) {
      res = res.filter(
        (i) =>
          (i.invoiceNumber || '').toLowerCase().includes(search) ||
          (i.orderId || '').toLowerCase().includes(search) ||
          (i.vendor?.companyName || i.vendorName || '').toLowerCase().includes(search)
      );
    }
    if (status && status !== 'All') {
      res = res.filter((i) => (i.paymentStatus || i.status) === status);
    }
    return res;
  }

  if (cleanPath.startsWith('/invoices/')) {
    const id = cleanPath.split('/')[2];
    if (cleanPath.endsWith('/status') && method === 'PATCH') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const idx = demoStore.invoices.findIndex((i) => i._id === id || i.invoiceNumber === id);
      if (idx !== -1) {
        const status = body.paymentStatus || body.status || 'Paid';
        demoStore.invoices[idx].paymentStatus = status;
        demoStore.invoices[idx].status = status;
        if (status === 'Paid') demoStore.invoices[idx].paidDate = new Date().toISOString().slice(0, 10);
        return demoStore.invoices[idx];
      }
    }
    if (method === 'DELETE') {
      demoStore.invoices = demoStore.invoices.filter((i) => i._id !== id && i.invoiceNumber !== id);
      return { success: true };
    }
    if (method === 'PUT' || method === 'PATCH') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const idx = demoStore.invoices.findIndex((i) => i._id === id || i.invoiceNumber === id);
      if (idx !== -1) {
        const amt = Number(body.amount) || demoStore.invoices[idx].amount;
        const tax = Math.round(amt * 0.18);
        demoStore.invoices[idx] = {
          ...demoStore.invoices[idx],
          ...body,
          amount: amt,
          tax,
          total: amt + tax
        };
        return demoStore.invoices[idx];
      }
    }
    return demoStore.invoices.find((i) => i._id === id || i.invoiceNumber === id) || demoStore.invoices[0];
  }

  if (cleanPath === '/products') return demoStore.products;
  if (cleanPath === '/activities') return demoStore.activities;
  if (cleanPath === '/users') {
    if (method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const newU = {
        _id: 'usr-' + Date.now(),
        id: 'usr-' + Date.now(),
        createdAt: new Date().toISOString(),
        ...body
      };
      if (!demoStore.users) demoStore.users = [];
      demoStore.users.unshift(newU);
      return newU;
    }
    const search = (new URLSearchParams(path.split('?')[1] || '')).get('search') || '';
    if (search) {
      const q = search.toLowerCase();
      return (demoStore.users || []).filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return demoStore.users || [];
  }

  if (cleanPath.startsWith('/users/')) {
    const id = cleanPath.split('/')[2];
    if (method === 'DELETE') {
      demoStore.users = (demoStore.users || []).filter((u) => u._id !== id && u.id !== id);
      return { success: true };
    }
    if (method === 'PUT') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const idx = (demoStore.users || []).findIndex((u) => u._id === id || u.id === id);
      if (idx !== -1) {
        demoStore.users[idx] = { ...demoStore.users[idx], ...body };
        return demoStore.users[idx];
      }
    }
    return (demoStore.users || []).find((u) => u._id === id || u.id === id) || (demoStore.users || [])[0];
  }

  return {};
}

export async function api(path, options = {}) {
  const token = localStorage.getItem('vendom_token');

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });

    // Check if the response returned HTML (happens on static hosts like Vercel with SPA rewrites)
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html') || response.status === 404) {
      console.info(`[Vendom Demo Fallback] Backend not reachable for ${path}. Serving interactive demo data.`);
      return handleMockRequest(path, options);
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      // If server returned a business error (like invalid password), throw it
      if (data && data.message) throw new Error(data.message);
      // Otherwise fall back to demo mode
      return handleMockRequest(path, options);
    }

    return data || handleMockRequest(path, options);
  } catch (err) {
    // If it's an explicit validation error from backend, rethrow
    if (err.message && (err.message.includes('Invalid email') || err.message.includes('required'))) {
      throw err;
    }
    // Fall back to client demo mock mode
    console.info(`[Vendom Demo Fallback] Using local fallback for ${path}:`, err.message);
    return handleMockRequest(path, options);
  }
}
