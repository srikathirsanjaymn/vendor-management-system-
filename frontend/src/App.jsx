import { useEffect, useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  CreditCard,
  Download,
  Edit3,
  ExternalLink,
  FileBarChart,
  FileCheck,
  FileText,
  Filter,
  PackageSearch,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import { api } from './services/api';
import { formatINR, formatShortINR } from './utils';
import './styles.css';

// Reusable Star Rating
function RatingStars({ rating }) {
  const r = Number(rating) || 4.5;
  return (
    <span className="rating-stars" title={`Rating: ${r.toFixed(1)} / 5.0`}>
      <Star size={13} fill="#f5b026" stroke="#f5b026" />
      <span>{r.toFixed(1)}</span>
    </span>
  );
}

// Reusable Pagination
function Pagination({ totalItems, pageSize = 8, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrap">
      <span>
        Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{' '}
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems} records
      </span>
      <div className="pagination-controls">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// Shared UI Primitives
function StatCard({ label, value, detail, tone, subPills }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div>
        <small>{detail}</small>
        {subPills && subPills.length > 0 && (
          <div className="stat-breakdown">
            {subPills.map((p, idx) => (
              <span key={idx} className="sub-stat-pill">{p}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="header-actions">{action}</div>}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Empty({ label }) {
  return (
    <div className="empty-state">
      <PackageSearch size={34} />
      <strong>No {label} found</strong>
      <span>Try refining your search or add a new entry.</span>
    </div>
  );
}

function TableShell({ children, loading, empty, label, total, page, pageSize, onPageChange }) {
  if (loading) return <div className="loading">Loading {label}...</div>;
  if (empty) return <Empty label={label} />;
  return (
    <div className="table-wrap">
      <table>{children}</table>
      {total && (
        <Pagination
          totalItems={total}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

// ==========================================
// 1. LOGIN
// ==========================================
function Login({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@vendom.com', password: 'admin123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const quickDemoLogin = () => {
    localStorage.setItem('vendom_token', 'demo-jwt-token-active');
    onLogin({
      id: 'usr-admin-demo',
      name: 'Kathir Sanjay',
      email: 'admin@vendom.com',
      role: 'admin'
    });
  };

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    let loginPayload = { ...form };
    if (loginPayload.email === 'admin@123' || loginPayload.email === 'admin') {
      loginPayload.email = 'admin@vendom.com';
    }

    try {
      const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(loginPayload) });
      localStorage.setItem('vendom_token', data.token || 'demo-jwt-token-active');
      onLogin(data.user || {
        id: 'usr-admin-demo',
        name: 'Kathir Sanjay',
        email: loginPayload.email,
        role: 'admin'
      });
    } catch (e) {
      setError(e.message || 'Login failed. Click "1-Click Instant Demo Login" below.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-panel">
        <div className="brand">
          <span className="brand-mark">V</span>
          <span>vendom</span>
        </div>
        <div className="login-copy">
          <span className="eyebrow">VENDOR OPERATIONS CONSOLE</span>
          <h1>Enterprise vendor management, simplified.</h1>
          <p>Deliver compliant procurement, active contracts, and smooth fulfilment across your partner network.</p>
        </div>
        <form onSubmit={submit} className="login-form">
          <label>
            Email
            <input
              type="text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@vendom.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="admin123"
              required
            />
          </label>
          {error && (
            <div className="error-message">
              <CircleAlert size={16} />
              {error}
            </div>
          )}
          <button className="primary-button full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in to Console'} <ArrowRight size={17} />
          </button>

          <button
            type="button"
            className="secondary-button full"
            onClick={quickDemoLogin}
            style={{
              marginTop: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#ecfdf5',
              borderColor: '#10b981',
              color: '#065f46',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={16} color="#059669" /> 1-Click Instant Demo Login
          </button>

          <small className="hint" style={{ marginTop: '0.75rem', display: 'block', textAlign: 'center' }}>
            Demo Account: <strong>admin@vendom.com</strong> &middot; Password: <strong>admin123</strong>
          </small>
        </form>
      </div>
      <div className="login-aside">
        <div className="aside-orbit"></div>
        <p>Vendor relationships, made visible.</p>
        <span>Real-time procurement & supplier intelligence.</span>
      </div>
    </main>
  );
}

// ==========================================
// 2. DASHBOARD
// ==========================================
function Dashboard({ stats, user, setPage }) {
  const v = stats?.vendors || { total: 20, active: 12, pending: 3, suspended: 2, inactive: 3 };
  const c = stats?.contracts || { total: 18, active: 12, expiringSoon: 3, expired: 2, draft: 1 };
  const o = stats?.orders || { total: 42, pending: 8, approved: 17, delivered: 12, cancelled: 3, rejected: 2 };
  const i = stats?.invoices || { total: 35, paid: 21, pending: 7, overdue: 4, rejected: 3 };

  const trend = stats?.monthlyTrend || [
    { month: 'Jan', amount: 120000, formatted: '₹1.2L' },
    { month: 'Feb', amount: 150000, formatted: '₹1.5L' },
    { month: 'Mar', amount: 110000, formatted: '₹1.1L' },
    { month: 'Apr', amount: 180000, formatted: '₹1.8L' },
    { month: 'May', amount: 210000, formatted: '₹2.1L' },
    { month: 'Jun', amount: 170000, formatted: '₹1.7L' },
    { month: 'Jul', amount: 240000, formatted: '₹2.4L' },
    { month: 'Aug', amount: 200000, formatted: '₹2.0L' },
    { month: 'Sep', amount: 270000, formatted: '₹2.7L' }
  ];

  const maxTrend = Math.max(...trend.map(t => t.amount), 300000);

  const categories = stats?.vendorDistribution?.length
    ? stats.vendorDistribution
    : [
        { category: 'Office Supplies', count: 3 },
        { category: 'IT Services', count: 3 },
        { category: 'Software', count: 2 },
        { category: 'Logistics', count: 2 },
        { category: 'Hardware', count: 2 },
        { category: 'Facility Management', count: 2 },
        { category: 'Consulting', count: 2 },
        { category: 'Manufacturing', count: 1 }
      ];

  const activities = stats?.recentActivities?.length
    ? stats.recentActivities
    : [
        { title: 'New vendor added', description: 'BluePeak Technologies was added to IT Services network.', type: 'vendor', timeAgo: '2 hours ago' },
        { title: 'Purchase order approved', description: 'Purchase order PO-1024 (₹56,800) approved.', type: 'order', timeAgo: '5 hours ago' },
        { title: 'Invoice marked as paid', description: 'Invoice INV-2041 (₹75,000) marked as paid.', type: 'invoice', timeAgo: '14 hours ago' },
        { title: 'Contract expiring soon', description: 'Contract CTR-1012 with MetroWorks expiring in 35 days.', type: 'contract', timeAgo: '1 day ago' },
        { title: 'Vendor rating updated', description: 'NexaTech Solutions received a 4.6 overall rating.', type: 'rating', timeAgo: '1 day ago' },
        { title: 'Registration pending', description: 'FutureGrid Technologies awaiting admin approval.', type: 'vendor', timeAgo: '2 days ago' }
      ];

  return (
    <>
      <div className="top-notice-bar">
        <div className="top-notice-left">
          <Sparkles size={15} color="#167c69" />
          <span>Demo Environment • Academic Prototype</span>
        </div>
        <div className="top-notice-right">
          Simulated multi-vendor data seeded and active
        </div>
      </div>

      <PageHeader
        eyebrow="OPERATIONAL OVERVIEW"
        title={`Good morning, ${user.name.split(' ')[0]}.`}
        description="Live summary of your vendor ecosystem, contracts, order pipeline, and fulfilment."
        action={
          <button className="primary-button" onClick={() => setPage('orders')}>
            <Plus size={17} /> Create Order
          </button>
        }
      />

      {/* 4 Main KPI Cards */}
      <div className="stats-grid">
        <StatCard
          label="Total Vendors"
          value={v.total}
          detail={`${v.active} active partners right now`}
          tone="mint"
          subPills={[`${v.active} Active`, `${v.pending} Pending`, `${v.suspended} Suspended`, `${v.inactive} Inactive`]}
        />
        <StatCard
          label="Contracts"
          value={c.total}
          detail={`${c.active} active · ${c.expiringSoon} expiring soon`}
          tone="blue"
          subPills={[`${c.active} Active`, `${c.expiringSoon} Expiring Soon`, `${c.expired} Expired`]}
        />
        <StatCard
          label="Total Orders"
          value={o.total}
          detail={`${o.pending} pending review · ${o.approved} in progress`}
          tone="coral"
          subPills={[`${o.pending} Pending`, `${o.approved} Approved`, `${o.delivered} Delivered`]}
        />
        <StatCard
          label="Invoices"
          value={i.total}
          detail={`${i.paid} settled · ${i.overdue} overdue`}
          tone="yellow"
          subPills={[`${i.paid} Paid`, `${i.pending} Pending`, `${i.overdue} Overdue`]}
        />
      </div>

      {/* Charts Grid: PO Trend & Vendor Distribution */}
      <div className="dashboard-grid">
        {/* Chart 1: PO Spending Trend */}
        <div className="chart-card">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">PROCUREMENT VOLUME</span>
              <h2>Purchase Order Trend (2026)</h2>
              <div className="panel-subtitle">Monthly order value across all vendor categories</div>
            </div>
            <button className="text-button" onClick={() => setPage('orders')}>
              View all orders <ArrowRight size={14} />
            </button>
          </div>

          <div className="chart-container">
            {trend.map((t, idx) => {
              const heightPct = Math.round((t.amount / maxTrend) * 100);
              return (
                <div key={idx} className="chart-col" title={`${t.month}: ${t.formatted}`}>
                  <span className="chart-val">{t.formatted}</span>
                  <div className="chart-bar-wrap">
                    <div className="chart-bar-fill" style={{ height: `${heightPct}%` }}></div>
                  </div>
                  <span className="chart-label">{t.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Category Distribution */}
        <div className="chart-card">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">DIVERSITY</span>
              <h2>Vendor Categories</h2>
              <div className="panel-subtitle">Distribution across supplier domains</div>
            </div>
            <button className="text-button" onClick={() => setPage('vendors')}>
              Directory <ArrowRight size={14} />
            </button>
          </div>

          <div className="category-list">
            {categories.slice(0, 7).map((cat, idx) => {
              const pct = Math.round((cat.count / v.total) * 100);
              return (
                <div key={idx} className="category-row">
                  <span className="category-name">{cat.category}</span>
                  <div className="category-bar-bg">
                    <div className="category-bar-fill" style={{ width: `${Math.max(pct, 12)}%` }}></div>
                  </div>
                  <span className="category-count">{cat.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lower Row: Recent Activity & Workflow */}
      <div className="dashboard-grid">
        {/* Recent Activities */}
        <div className="feed-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">AUDIT TRAIL</span>
              <h2>Recent Activities</h2>
            </div>
            <span className="panel-subtitle">Live events log</span>
          </div>

          <div className="activity-list">
            {activities.map((act, idx) => (
              <div key={idx} className="activity-item">
                <div className={`activity-icon ${act.type || 'system'}`}>
                  {act.type === 'vendor' && <Store size={15} />}
                  {act.type === 'order' && <CheckCircle2 size={15} />}
                  {act.type === 'invoice' && <CreditCard size={15} />}
                  {act.type === 'contract' && <FileText size={15} />}
                  {act.type === 'rating' && <Award size={15} />}
                  {!['vendor', 'order', 'invoice', 'contract', 'rating'].includes(act.type) && <Clock size={15} />}
                </div>
                <div className="activity-details">
                  <strong>{act.title}</strong>
                  <p>{act.description}</p>
                  <small className="activity-time">
                    {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : act.timeAgo}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow & Quick Shortcuts */}
        <div className="insight-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">ACTION QUEUE</span>
              <h2>Keep the queue moving</h2>
            </div>
          </div>

          <div className="workflow">
            <div className="workflow-step">
              <span className="step-number">01</span>
              <div>
                <strong>Review {o.pending} pending orders</strong>
                <p>Verify quantities and dispatch to assigned vendors.</p>
              </div>
              <button className="round-arrow" onClick={() => setPage('orders')}>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="workflow-step">
              <span className="step-number">02</span>
              <div>
                <strong>Audit {c.expiringSoon} expiring contracts</strong>
                <p>Prepare renewal terms before next 30-day cycle.</p>
              </div>
              <button className="round-arrow" onClick={() => setPage('contracts')}>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="workflow-step">
              <span className="step-number">03</span>
              <div>
                <strong>Reconcile {i.overdue} overdue invoices</strong>
                <p>Send payment reminders to finance auditing queue.</p>
              </div>
              <button className="round-arrow" onClick={() => setPage('invoices')}>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// 3. VENDORS PAGE
// ==========================================
const emptyVendor = {
  vendorId: '',
  vendorName: '',
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  city: 'Bengaluru',
  state: 'Karnataka',
  gstNumber: '',
  address: '',
  category: 'IT Services',
  services: '',
  status: 'Active'
};

const vendorCategories = [
  'All',
  'Office Supplies',
  'IT Services',
  'Software',
  'Hardware',
  'Logistics',
  'Manufacturing',
  'Consulting',
  'Facility Management',
  'Security Services',
  'Marketing',
  'Cloud Services'
];

function VendorForm({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    ...initial,
    services: Array.isArray(initial.services) ? initial.services.join(', ') : initial.services || ''
  });

  const change = (key, value) => setForm({ ...form, [key]: value });

  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...form,
          services: form.services.split(',').map((item) => item.trim()).filter(Boolean)
        });
      }}
    >
      <label>
        Vendor ID
        <input required value={form.vendorId} onChange={(e) => change('vendorId', e.target.value)} placeholder="e.g. VND-021" />
      </label>
      <label>
        Company Name
        <input required value={form.companyName} onChange={(e) => change('companyName', e.target.value)} placeholder="e.g. Acme Tech Solutions Ltd." />
      </label>
      <label>
        Contact Person
        <input required value={form.contactPerson || form.vendorName} onChange={(e) => { change('contactPerson', e.target.value); change('vendorName', e.target.value); }} placeholder="Full Name" />
      </label>
      <label>
        Category
        <select value={form.category} onChange={(e) => change('category', e.target.value)}>
          {vendorCategories.filter((c) => c !== 'All').map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        Email
        <input type="email" required value={form.email} onChange={(e) => change('email', e.target.value)} placeholder="contact@example.test" />
      </label>
      <label>
        Phone Number
        <input required value={form.phone} onChange={(e) => change('phone', e.target.value)} placeholder="+91 98000 00000" />
      </label>
      <label>
        City
        <input value={form.city} onChange={(e) => change('city', e.target.value)} placeholder="e.g. Chennai, Bengaluru" />
      </label>
      <label>
        GST Number
        <input value={form.gstNumber} onChange={(e) => change('gstNumber', e.target.value)} placeholder="e.g. 29AABCB5678H1Z2" />
      </label>
      <label className="wide">
        Address
        <input value={form.address} onChange={(e) => change('address', e.target.value)} placeholder="Industrial park, street, floor" />
      </label>
      <label className="wide">
        Products / Services <small>(comma separated)</small>
        <input value={form.services} onChange={(e) => change('services', e.target.value)} placeholder="e.g. Cloud Hosting, DevOps, Maintenance" />
      </label>
      <label>
        Status
        <select value={form.status} onChange={(e) => change('status', e.target.value)}>
          <option>Active</option>
          <option>Pending</option>
          <option>Suspended</option>
          <option>Inactive</option>
        </select>
      </label>
      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
        <button className="primary-button" disabled={saving}>{saving ? 'Saving...' : 'Save Vendor'}</button>
      </div>
    </form>
  );
}

function Vendors({ user, onSelect }) {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async () => {
    setLoading(true);
    try {
      const q = `/vendors?search=${encodeURIComponent(search)}&status=${status}&category=${category}`;
      setVendors(await api(q));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    setPage(1);
  }, [search, status, category]);

  async function save(form) {
    try {
      const path = modal.vendor ? `/vendors/${modal.vendor._id}` : '/vendors';
      await api(path, { method: modal.vendor ? 'PUT' : 'POST', body: JSON.stringify(form) });
      setModal(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleStatus(vendor) {
    const nextStatus = vendor.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api(`/vendors/${vendor._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(vendor) {
    if (!confirm(`Are you sure you want to remove ${vendor.companyName}? This action will delete linked products and orders.`)) return;
    try {
      await api(`/vendors/${vendor._id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  const pagedVendors = vendors.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <PageHeader
        eyebrow="SUPPLIER DIRECTORY"
        title="Vendors"
        description="Comprehensive supplier directory with contact details, ratings, compliance status, and active contracts."
        action={
          user.role === 'admin' && (
            <button className="primary-button" onClick={() => setModal({ vendor: null })}>
              <Plus size={17} /> Add Vendor
            </button>
          )
        }
      />

      {error && (
        <div className="error-message page-error">
          <CircleAlert size={16} />
          {error}
        </div>
      )}

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search vendors by name, category, city, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {vendorCategories.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Suspended">Suspended</option>
          <option value="Inactive">Inactive</option>
        </select>
        <span className="filter-label">{vendors.length} vendors</span>
      </div>

      <TableShell
        loading={loading}
        empty={!vendors.length}
        label="vendors"
        total={vendors.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      >
        <thead>
          <tr>
            <th>Vendor / Company</th>
            <th>Category</th>
            <th>Contact Person</th>
            <th>Location</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pagedVendors.map((vendor) => (
            <tr key={vendor._id}>
              <td>
                <button className="table-link" onClick={() => onSelect(vendor)}>
                  <strong>{vendor.companyName}</strong>
                  <small>{vendor.vendorId} · {vendor.email}</small>
                </button>
              </td>
              <td>{vendor.category}</td>
              <td>
                <strong>{vendor.contactPerson || vendor.vendorName}</strong>
                <small>{vendor.phone}</small>
              </td>
              <td>
                <span>{vendor.city || 'Chennai'}</span>
                <small>{vendor.state || 'India'}</small>
              </td>
              <td>
                <RatingStars rating={vendor.rating} />
              </td>
              <td>
                <button
                  className={`status-pill ${vendor.status.toLowerCase().replace(' ', '-')}`}
                  onClick={() => user.role === 'admin' && toggleStatus(vendor)}
                  title="Click to toggle status"
                >
                  <span></span>
                  {vendor.status}
                </button>
              </td>
              <td>{new Date(vendor.registrationDate || vendor.createdAt).toLocaleDateString()}</td>
              <td className="row-actions">
                {user.role === 'admin' && (
                  <>
                    <button className="icon-button" title="Edit vendor" onClick={() => setModal({ vendor })}>
                      <Edit3 size={15} />
                    </button>
                    <button className="icon-button danger" title="Delete vendor" onClick={() => remove(vendor)}>
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {modal && (
        <Modal title={modal.vendor ? 'Edit Vendor Details' : 'Add New Vendor'} onClose={() => setModal(null)}>
          <VendorForm initial={modal.vendor || emptyVendor} onSave={save} onClose={() => setModal(null)} />
        </Modal>
      )}
    </>
  );
}

// Vendor Profile Details Modal
function VendorProfile({ vendor, onClose, onOpenOrder }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api(`/vendors/${vendor._id}`).then(setData).catch(() => {});
  }, [vendor._id]);

  return (
    <Modal title="Vendor Dossier & Performance Profile" onClose={onClose}>
      {!data ? (
        <div className="loading">Loading vendor profile...</div>
      ) : (
        <div className="profile">
          <div className="profile-heading">
            <div className="profile-avatar">{data.vendor.companyName.slice(0, 2).toUpperCase()}</div>
            <div>
              <h2>{data.vendor.companyName}</h2>
              <p>{data.vendor.vendorId} · {data.vendor.category} · {data.vendor.city || 'India'}</p>
            </div>
            <span className={`status-pill ${data.vendor.status.toLowerCase()}`}>
              <span></span>
              {data.vendor.status}
            </span>
          </div>

          <div className="profile-info">
            <div>
              <small>Contact Person</small>
              <strong>{data.vendor.contactPerson || data.vendor.vendorName}</strong>
            </div>
            <div>
              <small>Email</small>
              <strong>{data.vendor.email}</strong>
            </div>
            <div>
              <small>Phone</small>
              <strong>{data.vendor.phone}</strong>
            </div>
            <div>
              <small>GST Identification</small>
              <strong>{data.vendor.gstNumber || '33AABCN1234F1Z5'}</strong>
            </div>
            <div>
              <small>Overall Rating</small>
              <RatingStars rating={data.vendor.rating} />
            </div>
            <div>
              <small>Facility Address</small>
              <strong>{data.vendor.address || 'Standard Registered Premises'}</strong>
            </div>
          </div>

          <h3>Performance Breakdown</h3>
          <div className="dimensions-list">
            {Object.entries(data.vendor.ratings || {
              quality: 4.8,
              delivery: 4.5,
              pricing: 4.4,
              communication: 4.7,
              reliability: 4.6,
              compliance: 4.6
            }).map(([k, val]) => (
              <div key={k} className="dimension-row">
                <span className="dimension-name">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                <div className="dimension-bar-bg">
                  <div className="dimension-bar-fill" style={{ width: `${(val / 5) * 100}%` }}></div>
                </div>
                <span className="dimension-val">{val}</span>
              </div>
            ))}
          </div>

          <h3>Supplied Products & Services ({data.products.length})</h3>
          <div className="mini-list">
            {data.products.length ? (
              data.products.map((p) => (
                <div key={p._id}>
                  <span>{p.name} ({p.productId})</span>
                  <strong>{formatINR(p.price)}</strong>
                </div>
              ))
            ) : (
              <small style={{ padding: '12px' }}>No catalog items linked.</small>
            )}
          </div>

          <h3>Recent Orders ({data.orders.length})</h3>
          <div className="mini-list">
            {data.orders.length ? (
              data.orders.slice(0, 4).map((o) => (
                <div key={o._id}>
                  <span>{o.orderId} · {o.product?.name || 'Supply item'}</span>
                  <span>
                    <strong>{formatINR(o.totalAmount)}</strong> · <small>{o.status}</small>
                  </span>
                </div>
              ))
            ) : (
              <small style={{ padding: '12px' }}>No recent purchase orders.</small>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ==========================================
// 4. PRODUCTS & SERVICES PAGE
// ==========================================
const emptyProduct = {
  productId: '',
  name: '',
  description: '',
  category: 'IT Services',
  price: '',
  quantity: '',
  vendor: '',
  status: 'Available'
};

function ProductForm({ initial, vendors, user, onSave, onClose }) {
  const [form, setForm] = useState({
    ...initial,
    vendor: initial.vendor?._id || initial.vendor || (user.role === 'vendor' ? user.vendor?._id : '')
  });

  const change = (k, v) => setForm({ ...form, [k]: v });

  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity)
        });
      }}
    >
      <label>
        Product / Service ID
        <input required value={form.productId} onChange={(e) => change('productId', e.target.value)} placeholder="e.g. PRD-125" />
      </label>
      <label>
        Name
        <input required value={form.name} onChange={(e) => change('name', e.target.value)} placeholder="e.g. Enterprise Server Diagnostics" />
      </label>
      <label className="wide">
        Description
        <input value={form.description} onChange={(e) => change('description', e.target.value)} placeholder="Brief summary of specification or SLA" />
      </label>
      <label>
        Category
        <select value={form.category} onChange={(e) => change('category', e.target.value)}>
          {vendorCategories.filter((c) => c !== 'All').map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        Unit Price (₹)
        <input type="number" min="0" step="100" required value={form.price} onChange={(e) => change('price', e.target.value)} placeholder="e.g. 15000" />
      </label>
      <label>
        Available Stock / Capacity
        <input type="number" min="0" required value={form.quantity} onChange={(e) => change('quantity', e.target.value)} placeholder="e.g. 50" />
      </label>
      {user.role === 'admin' && (
        <label>
          Assigned Vendor
          <select required value={form.vendor} onChange={(e) => change('vendor', e.target.value)}>
            <option value="">Select Vendor</option>
            {vendors.filter((v) => v.status === 'Active').map((v) => (
              <option value={v._id} key={v._id}>
                {v.companyName} ({v.category})
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
        <button className="primary-button">Save Product / Service</button>
      </div>
    </form>
  );
}

function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async () => {
    setLoading(true);
    try {
      setProducts(await api(`/products?search=${encodeURIComponent(search)}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (user.role === 'admin') api('/vendors').then(setVendors);
    setPage(1);
  }, [search]);

  async function save(form) {
    try {
      await api(modal.product ? `/products/${modal.product._id}` : '/products', {
        method: modal.product ? 'PUT' : 'POST',
        body: JSON.stringify(form)
      });
      setModal(null);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function remove(product) {
    if (!confirm(`Delete ${product.name}?`)) return;
    await api(`/products/${product._id}`, { method: 'DELETE' });
    load();
  }

  const filtered = useMemo(() => {
    if (category === 'All') return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  const pagedProducts = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <PageHeader
        eyebrow="SUPPLY CATALOGUE"
        title="Products & Services"
        description="Standardized items and deliverables offered across verified vendor partners with real-time stock."
        action={
          <button className="primary-button" onClick={() => setModal({ product: null })}>
            <Plus size={17} /> Add Product / Service
          </button>
        }
      />

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search products, IDs, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          {vendorCategories.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
          ))}
        </select>
        <span className="filter-label">{filtered.length} items listed</span>
      </div>

      <TableShell
        loading={loading}
        empty={!filtered.length}
        label="products"
        total={filtered.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      >
        <thead>
          <tr>
            <th>Product / Service</th>
            <th>Vendor Partner</th>
            <th>Category</th>
            <th>Unit Price</th>
            <th>Stock / Availability</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pagedProducts.map((product) => (
            <tr key={product._id}>
              <td>
                <strong>{product.name}</strong>
                <small>{product.productId} · {product.description}</small>
              </td>
              <td>
                <strong>{product.vendor?.companyName || product.vendor?.vendorName}</strong>
                <small>{product.vendor?.category}</small>
              </td>
              <td>{product.category}</td>
              <td>
                <strong>{formatINR(product.price)}</strong>
              </td>
              <td>
                <span className={`status-pill ${product.quantity > 0 ? 'active' : 'inactive'}`}>
                  <span></span>
                  {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                </span>
              </td>
              <td className="row-actions">
                <button className="icon-button" onClick={() => setModal({ product })}>
                  <Edit3 size={15} />
                </button>
                <button className="icon-button danger" onClick={() => remove(product)}>
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {modal && (
        <Modal title={modal.product ? 'Edit Item' : 'Add Product or Service'} onClose={() => setModal(null)}>
          <ProductForm
            initial={modal.product || emptyProduct}
            vendors={vendors}
            user={user}
            onSave={save}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </>
  );
}

// ==========================================
// 5. ORDERS PAGE
// ==========================================
const orderStatuses = ['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Rejected'];

function OrderCreateModal({ products, onSave, onClose }) {
  const [selectedProdId, setSelectedProdId] = useState(products[0]?._id || '');
  const [qty, setQty] = useState(1);
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const selectedProd = products.find((p) => p._id === selectedProdId) || products[0];

  return (
    <Modal title="Create New Purchase Order" onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            product: selectedProdId,
            quantity: Number(qty),
            expectedDelivery: new Date(expectedDate)
          });
        }}
      >
        <label className="wide">
          Select Product / Service
          <select value={selectedProdId} onChange={(e) => setSelectedProdId(e.target.value)} required>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} — {p.vendor?.companyName} ({formatINR(p.price)})
              </option>
            ))}
          </select>
        </label>
        <label>
          Vendor
          <input disabled value={selectedProd?.vendor?.companyName || ''} />
        </label>
        <label>
          Unit Price
          <input disabled value={formatINR(selectedProd?.price || 0)} />
        </label>
        <label>
          Order Quantity
          <input
            type="number"
            min="1"
            max={selectedProd?.quantity || 100}
            required
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </label>
        <label>
          Total Calculated Value
          <input disabled value={formatINR((selectedProd?.price || 0) * Number(qty))} />
        </label>
        <label className="wide">
          Expected Delivery Date
          <input
            type="date"
            required
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
          />
        </label>
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button">Submit Purchase Order</button>
        </div>
      </form>
    </Modal>
  );
}

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await api(`/orders?search=${encodeURIComponent(search)}&status=${status}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    api('/products').then(setProducts).catch(() => {});
    setPage(1);
  }, [search, status]);

  async function updateStatus(id, newStatus) {
    try {
      await api(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function createOrder(data) {
    try {
      await api('/orders', { method: 'POST', body: JSON.stringify(data) });
      setCreateModal(false);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  const pagedOrders = orders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <PageHeader
        eyebrow="FULFILMENT & REQUISITION"
        title="Orders"
        description="Manage purchase orders from initial approval through dispatch, transit, and delivery."
        action={
          user.role === 'admin' && (
            <button className="primary-button" onClick={() => setCreateModal(true)}>
              <Plus size={17} /> New Purchase Order
            </button>
          )
        }
      />

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search order ID (e.g. PO-1024)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          {orderStatuses.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <span className="filter-label">{orders.length} orders total</span>
      </div>

      <TableShell
        loading={loading}
        empty={!orders.length}
        label="orders"
        total={orders.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      >
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Vendor</th>
            <th>Item Details</th>
            <th>Total Value</th>
            <th>Order Date</th>
            <th>Expected Delivery</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pagedOrders.map((order) => (
            <tr key={order._id}>
              <td>
                <strong>{order.orderId}</strong>
                <small>Qty {order.quantity}</small>
              </td>
              <td>
                <strong>{order.vendor?.companyName || order.vendor?.vendorName}</strong>
                <small>{order.vendor?.vendorId}</small>
              </td>
              <td>
                <strong>{order.product?.name || 'Supply Item'}</strong>
                <small>{order.product?.category}</small>
              </td>
              <td>
                <strong>{formatINR(order.totalAmount)}</strong>
                <small>{formatINR(order.unitPrice || Math.round(order.totalAmount / (order.quantity || 1)))} / unit</small>
              </td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>
                {order.expectedDelivery
                  ? new Date(order.expectedDelivery).toLocaleDateString()
                  : new Date(new Date(order.orderDate).getTime() + 7 * 86400000).toLocaleDateString()}
              </td>
              <td>
                <select
                  className={`status-select ${order.status.toLowerCase().replace(' ', '-')}`}
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  {orderStatuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {createModal && (
        <OrderCreateModal
          products={products}
          onSave={createOrder}
          onClose={() => setCreateModal(false)}
        />
      )}
    </>
  );
}

// ==========================================
// 6. CONTRACTS PAGE
// ==========================================
const contractStatuses = ['Active', 'Expiring Soon', 'Expired', 'Draft', 'Terminated'];

function ContractForm({ initial, vendors, onSave, onClose }) {
  const [form, setForm] = useState({
    contractId: initial.contractId || '',
    contractTitle: initial.contractTitle || '',
    vendor: initial.vendor?._id || initial.vendor || vendors[0]?._id || '',
    contractValue: initial.contractValue || '',
    paymentTerms: initial.paymentTerms || 'Net 30',
    status: initial.status || 'Active',
    startDate: initial.startDate ? new Date(initial.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: initial.endDate ? new Date(initial.endDate).toISOString().split('T')[0] : new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]
  });

  const change = (k, v) => setForm({ ...form, [k]: v });

  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...form,
          contractValue: Number(form.contractValue),
          startDate: new Date(form.startDate),
          endDate: new Date(form.endDate)
        });
      }}
    >
      <label>
        Contract ID
        <input required value={form.contractId} onChange={(e) => change('contractId', e.target.value)} placeholder="e.g. CTR-1019" />
      </label>
      <label>
        Vendor
        <select value={form.vendor} onChange={(e) => change('vendor', e.target.value)} required>
          {vendors.map((v) => (
            <option key={v._id} value={v._id}>{v.companyName}</option>
          ))}
        </select>
      </label>
      <label className="wide">
        Contract Title
        <input required value={form.contractTitle} onChange={(e) => change('contractTitle', e.target.value)} placeholder="e.g. Annual IT Infrastructure SLA" />
      </label>
      <label>
        Contract Value (₹)
        <input type="number" min="0" required value={form.contractValue} onChange={(e) => change('contractValue', e.target.value)} placeholder="e.g. 500000" />
      </label>
      <label>
        Payment Terms
        <select value={form.paymentTerms} onChange={(e) => change('paymentTerms', e.target.value)}>
          <option>Net 30</option>
          <option>Net 45</option>
          <option>Quarterly Advance</option>
          <option>Milestone-based</option>
        </select>
      </label>
      <label>
        Start Date
        <input type="date" required value={form.startDate} onChange={(e) => change('startDate', e.target.value)} />
      </label>
      <label>
        End Date
        <input type="date" required value={form.endDate} onChange={(e) => change('endDate', e.target.value)} />
      </label>
      <label>
        Status
        <select value={form.status} onChange={(e) => change('status', e.target.value)}>
          {contractStatuses.map((st) => (
            <option key={st}>{st}</option>
          ))}
        </select>
      </label>
      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
        <button className="primary-button">Save Contract</button>
      </div>
    </form>
  );
}

function Contracts({ user }) {
  const [contracts, setContracts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async () => {
    setLoading(true);
    try {
      setContracts(await api(`/contracts?search=${encodeURIComponent(search)}&status=${status}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    api('/vendors').then(setVendors).catch(() => {});
    setPage(1);
  }, [search, status]);

  async function save(form) {
    try {
      await api(modal.contract ? `/contracts/${modal.contract._id}` : '/contracts', {
        method: modal.contract ? 'PUT' : 'POST',
        body: JSON.stringify(form)
      });
      setModal(null);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function remove(c) {
    if (!confirm(`Delete contract ${c.contractId}?`)) return;
    await api(`/contracts/${c._id}`, { method: 'DELETE' });
    load();
  }

  const pagedContracts = contracts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <PageHeader
        eyebrow="LEGAL & AGREEMENTS"
        title="Contracts"
        description="Active master service agreements, renewal schedules, and contractual value commitments."
        action={
          user.role === 'admin' && (
            <button className="primary-button" onClick={() => setModal({ contract: null })}>
              <Plus size={17} /> Add Contract
            </button>
          )
        }
      />

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search contract ID or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All Contract Statuses</option>
          {contractStatuses.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
        <span className="filter-label">{contracts.length} contracts</span>
      </div>

      <TableShell
        loading={loading}
        empty={!contracts.length}
        label="contracts"
        total={contracts.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      >
        <thead>
          <tr>
            <th>Contract</th>
            <th>Vendor Partner</th>
            <th>Value</th>
            <th>Payment Terms</th>
            <th>Valid Period</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pagedContracts.map((ctr) => (
            <tr key={ctr._id}>
              <td>
                <strong>{ctr.contractTitle}</strong>
                <small>{ctr.contractId}</small>
              </td>
              <td>
                <strong>{ctr.vendor?.companyName || ctr.vendor?.vendorName}</strong>
                <small>{ctr.vendor?.vendorId}</small>
              </td>
              <td>
                <strong>{formatINR(ctr.contractValue)}</strong>
              </td>
              <td>{ctr.paymentTerms}</td>
              <td>
                <span>{new Date(ctr.startDate).toLocaleDateString()}</span> to{' '}
                <strong>{new Date(ctr.endDate).toLocaleDateString()}</strong>
              </td>
              <td>
                <span className={`status-pill ${ctr.status.toLowerCase().replace(' ', '-')}`}>
                  <span></span>
                  {ctr.status}
                </span>
              </td>
              <td className="row-actions">
                {user.role === 'admin' && (
                  <>
                    <button className="icon-button" onClick={() => setModal({ contract: ctr })}>
                      <Edit3 size={15} />
                    </button>
                    <button className="icon-button danger" onClick={() => remove(ctr)}>
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {modal && (
        <Modal title={modal.contract ? 'Edit Contract' : 'Create New Contract'} onClose={() => setModal(null)}>
          <ContractForm
            initial={modal.contract || {}}
            vendors={vendors}
            onSave={save}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </>
  );
}

// ==========================================
// 7. INVOICES PAGE
// ==========================================
const invoiceStatuses = ['Paid', 'Pending', 'Overdue', 'Approved', 'Rejected'];

function InvoiceForm({ initial, vendors, onSave, onClose }) {
  const [form, setForm] = useState({
    invoiceNumber: initial.invoiceNumber || '',
    vendor: initial.vendor?._id || initial.vendor || vendors[0]?._id || '',
    orderId: initial.orderId || '',
    amount: initial.amount || '',
    dueDate: initial.dueDate ? new Date(initial.dueDate).toISOString().split('T')[0] : new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    paymentStatus: initial.paymentStatus || 'Pending'
  });

  const change = (k, v) => setForm({ ...form, [k]: v });

  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault();
        const amt = Number(form.amount);
        const tax = Math.round(amt * 0.18);
        onSave({
          ...form,
          amount: amt,
          tax,
          total: amt + tax,
          dueDate: new Date(form.dueDate)
        });
      }}
    >
      <label>
        Invoice Number
        <input required value={form.invoiceNumber} onChange={(e) => change('invoiceNumber', e.target.value)} placeholder="e.g. INV-2036" />
      </label>
      <label>
        Vendor
        <select value={form.vendor} onChange={(e) => change('vendor', e.target.value)} required>
          {vendors.map((v) => (
            <option key={v._id} value={v._id}>{v.companyName}</option>
          ))}
        </select>
      </label>
      <label>
        Purchase Order Reference
        <input value={form.orderId} onChange={(e) => change('orderId', e.target.value)} placeholder="e.g. PO-1025" />
      </label>
      <label>
        Base Amount (₹)
        <input type="number" min="0" required value={form.amount} onChange={(e) => change('amount', e.target.value)} placeholder="e.g. 50000" />
      </label>
      <label>
        Due Date
        <input type="date" required value={form.dueDate} onChange={(e) => change('dueDate', e.target.value)} />
      </label>
      <label>
        Payment Status
        <select value={form.paymentStatus} onChange={(e) => change('paymentStatus', e.target.value)}>
          {invoiceStatuses.map((st) => (
            <option key={st}>{st}</option>
          ))}
        </select>
      </label>
      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
        <button className="primary-button">Save Invoice</button>
      </div>
    </form>
  );
}

function Invoices({ user }) {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async () => {
    setLoading(true);
    try {
      setInvoices(await api(`/invoices?search=${encodeURIComponent(search)}&status=${status}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    api('/vendors').then(setVendors).catch(() => {});
    setPage(1);
  }, [search, status]);

  async function save(form) {
    try {
      await api(modal.invoice ? `/invoices/${modal.invoice._id}` : '/invoices', {
        method: modal.invoice ? 'PUT' : 'POST',
        body: JSON.stringify(form)
      });
      setModal(null);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function markPaid(inv) {
    try {
      await api(`/invoices/${inv._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ paymentStatus: 'Paid' })
      });
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function remove(inv) {
    if (!confirm(`Delete invoice ${inv.invoiceNumber}?`)) return;
    await api(`/invoices/${inv._id}`, { method: 'DELETE' });
    load();
  }

  const pagedInvoices = invoices.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <PageHeader
        eyebrow="ACCOUNTS PAYABLE"
        title="Invoices"
        description="Vendor billing, GST reconciliation, milestone disbursement, and invoice settlements."
        action={
          user.role === 'admin' && (
            <button className="primary-button" onClick={() => setModal({ invoice: null })}>
              <Plus size={17} /> Add Invoice
            </button>
          )
        }
      />

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search invoice # or PO reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All Payment Statuses</option>
          {invoiceStatuses.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
        <span className="filter-label">{invoices.length} invoices recorded</span>
      </div>

      <TableShell
        loading={loading}
        empty={!invoices.length}
        label="invoices"
        total={invoices.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      >
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Vendor</th>
            <th>PO Ref</th>
            <th>Due Date</th>
            <th>Tax (18% GST)</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pagedInvoices.map((inv) => (
            <tr key={inv._id}>
              <td>
                <strong>{inv.invoiceNumber}</strong>
                <small>{new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString()}</small>
              </td>
              <td>
                <strong>{inv.vendor?.companyName || inv.vendor?.vendorName}</strong>
                <small>{inv.vendor?.vendorId}</small>
              </td>
              <td>
                <span style={{ fontWeight: 600, color: '#32524a' }}>{inv.orderId || '—'}</span>
              </td>
              <td>
                <span className={inv.paymentStatus === 'Overdue' ? 'status-pill overdue' : ''}>
                  {new Date(inv.dueDate).toLocaleDateString()}
                </span>
              </td>
              <td>{formatINR(inv.tax)}</td>
              <td>
                <strong>{formatINR(inv.total)}</strong>
              </td>
              <td>
                <span className={`status-pill ${inv.paymentStatus.toLowerCase()}`}>
                  <span></span>
                  {inv.paymentStatus}
                </span>
              </td>
              <td className="row-actions">
                {inv.paymentStatus !== 'Paid' && (
                  <button
                    className="outline-button"
                    style={{ padding: '4px 8px', fontSize: '11px', marginRight: '6px' }}
                    onClick={() => markPaid(inv)}
                    title="Mark as paid"
                  >
                    Pay
                  </button>
                )}
                {user.role === 'admin' && (
                  <button className="icon-button danger" onClick={() => remove(inv)}>
                    <Trash2 size={15} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {modal && (
        <Modal title={modal.invoice ? 'Edit Invoice' : 'Create Vendor Invoice'} onClose={() => setModal(null)}>
          <InvoiceForm
            initial={modal.invoice || {}}
            vendors={vendors}
            onSave={save}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </>
  );
}

// ==========================================
// 8. PERFORMANCE PAGE
// ==========================================
function EvaluationModal({ vendor, onSave, onClose }) {
  const current = vendor.ratings || {
    quality: 4.5,
    delivery: 4.5,
    pricing: 4.0,
    communication: 4.5,
    reliability: 4.5,
    compliance: 4.5
  };

  const [ratings, setRatings] = useState({ ...current });

  const update = (key, val) => setRatings({ ...ratings, [key]: Number(val) });

  const avg = (
    Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length
  ).toFixed(1);

  return (
    <Modal title={`Vendor Performance Evaluation — ${vendor.companyName}`} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(ratings);
        }}
      >
        <div style={{ marginBottom: '18px', textAlign: 'center', background: '#f5faf7', padding: '14px', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#688078', fontWeight: 600 }}>CALCULATED OVERALL SCORE</span>
          <div style={{ font: '800 36px Syne', color: '#167c69', margin: '4px 0' }}>{avg} / 5.0</div>
          <small style={{ color: '#8a9e97' }}>Computed dynamically from 6 audited criteria</small>
        </div>

        <div className="form-grid">
          {Object.entries(ratings).map(([k, val]) => (
            <label key={k}>
              {k.charAt(0).toUpperCase() + k.slice(1)} (1.0 to 5.0)
              <input
                type="number"
                min="1.0"
                max="5.0"
                step="0.1"
                value={val}
                onChange={(e) => update(k, e.target.value)}
                required
              />
            </label>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button">Submit Performance Evaluation</button>
        </div>
      </form>
    </Modal>
  );
}

function Performance({ user }) {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('All');
  const [evaluatingVendor, setEvaluatingVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setVendors(await api('/vendors'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function saveEvaluation(ratings) {
    try {
      await api(`/vendors/${evaluatingVendor._id}/ratings`, {
        method: 'PUT',
        body: JSON.stringify(ratings)
      });
      setEvaluatingVendor(null);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const matchSearch =
        v.companyName.toLowerCase().includes(search.toLowerCase()) ||
        v.category.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      const score = v.rating || 4.5;
      if (tier === 'Preferred' && score < 4.5) return false;
      if (tier === 'Verified' && (score < 4.0 || score >= 4.5)) return false;
      if (tier === 'Review' && score >= 4.0) return false;
      return true;
    });
  }, [vendors, search, tier]);

  return (
    <>
      <PageHeader
        eyebrow="QUALITY & COMPLIANCE AUDIT"
        title="Vendor Performance"
        description="Multi-factor supplier scorecards evaluating SLA quality, timeliness, commercial pricing, and regulatory compliance."
      />

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search vendor scorecard by company or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="All">All Performance Tiers</option>
          <option value="Preferred">Tier 1 — Preferred Partners (≥ 4.5★)</option>
          <option value="Verified">Tier 2 — Verified Suppliers (4.0–4.4★)</option>
          <option value="Review">Tier 3 — Under Review (&lt; 4.0★)</option>
        </select>
        <span className="filter-label">{filtered.length} evaluated vendors</span>
      </div>

      {loading ? (
        <div className="loading">Loading performance scorecards...</div>
      ) : !filtered.length ? (
        <Empty label="evaluations" />
      ) : (
        <div className="scorecard-grid">
          {filtered.map((vendor) => {
            const score = vendor.rating || 4.5;
            const dims = vendor.ratings || {
              quality: 4.8,
              delivery: 4.5,
              pricing: 4.4,
              communication: 4.7,
              reliability: 4.6,
              compliance: 4.6
            };

            const tierClass = score >= 4.5 ? 'preferred' : score >= 4.0 ? 'verified' : 'review';
            const tierLabel = score >= 4.5 ? 'Tier 1 • Preferred Partner' : score >= 4.0 ? 'Tier 2 • Verified Supplier' : 'Tier 3 • Under Review';

            return (
              <div key={vendor._id} className="scorecard-card">
                <div>
                  <div className="scorecard-top">
                    <div>
                      <h3>{vendor.companyName}</h3>
                      <p>{vendor.category} · {vendor.city || 'India'}</p>
                      <span className={`tier-tag ${tierClass}`}>{tierLabel}</span>
                    </div>
                    <div className="score-badge">
                      <Star size={15} fill="#78580b" />
                      <span>{score.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="dimensions-list">
                    {Object.entries(dims).map(([dName, val]) => (
                      <div key={dName} className="dimension-row">
                        <span className="dimension-name">{dName.charAt(0).toUpperCase() + dName.slice(1)}</span>
                        <div className="dimension-bar-bg">
                          <div className="dimension-bar-fill" style={{ width: `${(val / 5) * 100}%` }}></div>
                        </div>
                        <span className="dimension-val">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '14px', borderTop: '1px solid var(--line)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: '#889e96' }}>Status: {vendor.status}</small>
                  {user.role === 'admin' && (
                    <button
                      className="outline-button"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => setEvaluatingVendor(vendor)}
                    >
                      Audit / Rate Vendor
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {evaluatingVendor && (
        <EvaluationModal
          vendor={evaluatingVendor}
          onSave={saveEvaluation}
          onClose={() => setEvaluatingVendor(null)}
        />
      )}
    </>
  );
}

// ==========================================
// 9. REPORTS PAGE
// ==========================================
function Reports() {
  const [downloading, setDownloading] = useState(false);

  function exportCSV() {
    setDownloading(true);
    setTimeout(() => {
      const csvContent =
        'Vendor,Category,City,Status,Rating,Active Contracts,Total Spend\n' +
        'Northstar Supplies Ltd.,Office Supplies,Chennai,Active,4.6,1,₹3,50,000\n' +
        'BluePeak Technologies,IT Services,Bengaluru,Active,4.8,2,₹10,60,000\n' +
        'GreenLeaf Office Solutions,Office Supplies,Hyderabad,Active,4.2,1,₹2,90,000\n' +
        'Vertex Logistics,Logistics,Mumbai,Active,4.4,2,₹9,60,000\n' +
        'PrimeCore Systems,Hardware,Pune,Active,4.0,1,₹5,40,000\n' +
        'UrbanEdge Facilities,Facility Management,Coimbatore,Active,3.9,2,₹11,90,000\n' +
        'NexaTech Solutions,Software,Bengaluru,Active,4.7,1,₹11,40,000\n' +
        'BrightSource Consulting,Consulting,Delhi,Active,4.5,1,₹4,20,000\n' +
        'Apex Industrial Supplies,Manufacturing,Chennai,Active,3.8,1,₹3,10,000\n' +
        'CloudBridge Services,Cloud Services,Hyderabad,Active,4.8,1,₹14,50,000\n';

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'Vendom_Procurement_Intelligence_Report_2026.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }, 600);
  }

  return (
    <>
      <PageHeader
        eyebrow="ANALYTICS & AUDIT"
        title="Procurement Reports"
        description="Executive procurement metrics, budget disbursement breakdown, and SLA compliance audits."
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="secondary-button" onClick={() => window.print()}>
              <Printer size={16} /> Print Report
            </button>
            <button className="primary-button" onClick={exportCSV} disabled={downloading}>
              <Download size={16} /> {downloading ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        }
      />

      <div className="report-metrics">
        <div className="report-metric-box">
          <span>YTD TOTAL PROCUREMENT SPEND</span>
          <strong>₹87.4 Lakhs</strong>
          <small>Across 42 Purchase Orders</small>
        </div>
        <div className="report-metric-box">
          <span>SUPPLIER SLA COMPLIANCE RATE</span>
          <strong>96.4%</strong>
          <small>On-time delivery average: 4.8 days</small>
        </div>
        <div className="report-metric-box">
          <span>AVERAGE VENDOR SCORE</span>
          <strong>4.3 / 5.0</strong>
          <small>Based on 20 partner evaluations</small>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">BUDGET ALLOCATION</span>
              <h2>Procurement Spend by Domain</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '14px', marginTop: '12px' }}>
            {[
              { category: 'Cloud & IT Services', amt: 2850000, pct: 33 },
              { category: 'Software & Development', amt: 1840000, pct: 21 },
              { category: 'Facility Management', amt: 1420000, pct: 16 },
              { category: 'Hardware & Infrastructure', amt: 1120000, pct: 13 },
              { category: 'Logistics & Freight', amt: 850000, pct: 10 },
              { category: 'Office Supplies & Stationery', amt: 660000, pct: 7 }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 100px', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#273c37' }}>{item.category}</span>
                <div style={{ height: '9px', background: '#eef3f0', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: '#167c69' }}></div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, textAlign: 'right' }}>{formatShortINR(item.amt)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="report-card">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">UPCOMING RENEWALS</span>
              <h2>Contract Expiry Radar</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
            {[
              { title: 'DevOps Automation Retainer', vendor: 'BluePeak Technologies', days: '35 days remaining', val: '₹2.8L' },
              { title: 'Express Freight Route SLA', vendor: 'Vertex Logistics', days: '45 days remaining', val: '₹3.4L' },
              { title: 'HVAC Air Sanitation', vendor: 'UrbanEdge Facilities', days: '52 days remaining', val: '₹2.1L' }
            ].map((r, idx) => (
              <div key={idx} style={{ padding: '12px', background: '#fcfdfc', border: '1px solid var(--line)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '13px', color: '#203a38' }}>{r.title}</strong>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#167c69' }}>{r.val}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: '#889c95' }}>
                  <span>{r.vendor}</span>
                  <span style={{ color: '#b0611e', fontWeight: 700 }}>{r.days}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// 10. USERS PAGE
// ==========================================
function UserModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    email: initial.email || '',
    role: initial.role || 'admin',
    password: ''
  });

  return (
    <Modal title={initial._id ? 'Edit User Credentials' : 'Add System Console User'} onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
      >
        <label>
          Full Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" />
        </label>
        <label>
          Email Address
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="username@vendom.com" />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="admin">System Admin</option>
            <option value="vendor">Vendor Representative</option>
          </select>
        </label>
        <label>
          Password {initial._id && <small>(Leave blank to keep current)</small>}
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            required={!initial._id}
          />
        </label>
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button">Save User</button>
        </div>
      </form>
    </Modal>
  );
}

function UsersList({ user }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await api(`/users?search=${encodeURIComponent(search)}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search]);

  async function saveUser(form) {
    try {
      await api(modal.user ? `/users/${modal.user._id}` : '/users', {
        method: modal.user ? 'PUT' : 'POST',
        body: JSON.stringify(form)
      });
      setModal(null);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function removeUser(u) {
    if (!confirm(`Remove user ${u.name}?`)) return;
    try {
      await api(`/users/${u._id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="ACCESS CONTROL"
        title="Users & Permissions"
        description="Internal procurement team members and authenticated vendor portal representatives."
        action={
          user.role === 'admin' && (
            <button className="primary-button" onClick={() => setModal({ user: null })}>
              <Plus size={17} /> Add User
            </button>
          )
        }
      />

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="filter-label">{users.length} active users</span>
      </div>

      <TableShell loading={loading} empty={!users.length} label="users">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Organization / Vendor</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                    {u.name?.charAt(0)}
                  </div>
                  <strong>{u.name}</strong>
                </div>
              </td>
              <td>{u.email}</td>
              <td>
                <span className={`status-pill ${u.role === 'admin' ? 'active' : 'pending'}`}>
                  <span></span>
                  {u.role === 'admin' ? 'Admin / Procurement' : 'Vendor Portal'}
                </span>
              </td>
              <td>{u.vendor?.companyName || 'Vendom Operations Central'}</td>
              <td>{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
              <td className="row-actions">
                {user.role === 'admin' && u.email !== 'admin@vendom.com' && (
                  <>
                    <button className="icon-button" onClick={() => setModal({ user: u })}>
                      <Edit3 size={15} />
                    </button>
                    <button className="icon-button danger" onClick={() => removeUser(u)}>
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {modal && (
        <UserModal
          initial={modal.user || {}}
          onSave={saveUser}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

// ==========================================
// 11. SETTINGS PAGE
// ==========================================
function Settings({ onRefreshData }) {
  const [resetting, setResetting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  async function resetDemoData() {
    if (!confirm('Reset demo dataset? This will restore the initial 20 vendors, 42 orders, 18 contracts, and 35 invoices.')) {
      return;
    }
    setResetting(true);
    setSuccessMsg('');
    try {
      await api('/dashboard/reset-demo', { method: 'POST' });
      setSuccessMsg('Demo data has been successfully reset to baseline. All tables and charts are refreshed.');
      if (onRefreshData) onRefreshData();
    } catch (e) {
      alert(e.message);
    } finally {
      setResetting(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="CONFIGURATION"
        title="Settings"
        description="System environment configurations, financial localization, and presentation simulation controls."
      />

      {successMsg && (
        <div className="success-message">
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      <div className="settings-grid">
        <div className="settings-box">
          <h2>Presentation & Simulation Controls</h2>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Reset Demo Database to Baseline</strong>
              <small>Restores 20 vendors, 22 products, 42 orders, 18 contracts, and 35 invoices in one click.</small>
            </div>
            <div className="setting-control">
              <button className="danger-button" onClick={resetDemoData} disabled={resetting}>
                <RotateCcw size={15} />
                {resetting ? 'Resetting Demo...' : 'Reset Demo Data'}
              </button>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Simulated Data Watermark</strong>
              <small>Displays subtle "Demo Environment" badge for college evaluators.</small>
            </div>
            <div className="setting-control">
              <span className="status-pill active"><span></span>Enabled</span>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Currency & Financial Formatting</strong>
              <small>Indian Rupee (₹ INR) with Lakhs and Crores denomination grouping.</small>
            </div>
            <div className="setting-control">
              <strong style={{ color: '#167c69' }}>₹ INR (Lakhs)</strong>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Taxation Calculation</strong>
              <small>Default statutory Goods and Services Tax applied on vendor billing.</small>
            </div>
            <div className="setting-control">
              <strong>18% GST</strong>
            </div>
          </div>
        </div>

        <div className="settings-box">
          <h2>System Information</h2>
          <div className="setting-row">
            <div className="setting-info">
              <strong>Application</strong>
              <small>Vendom Vendor Management System</small>
            </div>
            <div className="setting-control">
              <span style={{ fontWeight: 600 }}>v1.0.0 (Prototype)</span>
            </div>
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <strong>Stack</strong>
              <small>React 19 + Express + MongoDB Mongoose</small>
            </div>
            <div className="setting-control">
              <span style={{ fontWeight: 600 }}>MERN Architecture</span>
            </div>
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <strong>Storage Engine</strong>
              <small>MongoDB with zero-config memory fallback</small>
            </div>
            <div className="setting-control">
              <span className="status-pill active"><span></span>Connected</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const defaultAdminUser = {
  id: 'usr-admin-demo',
  name: 'Kathir Sanjay',
  email: 'admin@vendom.com',
  role: 'admin'
};

export default function App() {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('vendom_logged_out') === 'true') {
      return null;
    }
    return defaultAdminUser;
  });
  const [page, setPage] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const fetchStats = () => {
    api('/dashboard').then(setStats).catch(() => {});
  };

  useEffect(() => {
    const token = localStorage.getItem('vendom_token');
    if (token) {
      api('/auth/me')
        .then((data) => {
          if (data && data.user) setUser(data.user);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, page]);

  const handleLogin = (loggedUser) => {
    sessionStorage.removeItem('vendom_logged_out');
    setUser(loggedUser || defaultAdminUser);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const logout = () => {
    sessionStorage.setItem('vendom_logged_out', 'true');
    localStorage.removeItem('vendom_token');
    setUser(null);
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} user={user} onLogout={logout} />
      <main className="content">
        <div className="mobile-top">
          <div className="brand">
            <span className="brand-mark">V</span>
            <span>vendom</span>
          </div>
        </div>

        {page === 'dashboard' && <Dashboard stats={stats} user={user} setPage={setPage} />}
        {page === 'vendors' && <Vendors user={user} onSelect={setSelectedVendor} />}
        {page === 'products' && <Products user={user} />}
        {page === 'orders' && <Orders user={user} />}
        {page === 'contracts' && <Contracts user={user} />}
        {page === 'invoices' && <Invoices user={user} />}
        {page === 'performance' && <Performance user={user} />}
        {page === 'reports' && <Reports />}
        {page === 'users' && <UsersList user={user} />}
        {page === 'settings' && <Settings onRefreshData={fetchStats} />}
      </main>

      {selectedVendor && (
        <VendorProfile
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onOpenOrder={() => {
            setSelectedVendor(null);
            setPage('orders');
          }}
        />
      )}
    </div>
  );
}
