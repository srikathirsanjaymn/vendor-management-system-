import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'vendom-secure-jwt-secret-key-2026';

// Persistent In-Memory Database for Vercel Serverless
let vendors = [
  {
    _id: 'vnd-001',
    vendorId: 'VND-001',
    vendorName: 'Northstar Supplies',
    companyName: 'Northstar Supplies Ltd.',
    email: 'hello@northstar.test',
    phone: '+91 98401 22301',
    contactPerson: 'Rajesh Raman',
    city: 'Chennai',
    state: 'Tamil Nadu',
    gstNumber: '33AABCN1234F1Z5',
    address: '18 Anna Salai, Guindy Industrial Estate',
    category: 'Office Supplies',
    services: ['Stationery Package', 'Desk Accessories', 'Bulk Paper Supplies'],
    status: 'Active',
    rating: 4.6,
    ratings: { quality: 4.8, delivery: 4.5, pricing: 4.4, communication: 4.7, reliability: 4.6, compliance: 4.6 },
    registrationDate: '2024-01-15'
  },
  {
    _id: 'vnd-002',
    vendorId: 'VND-002',
    vendorName: 'BluePeak Technologies',
    companyName: 'BluePeak Technologies Pvt Ltd',
    email: 'contact@bluepeak.test',
    phone: '+91 98802 33412',
    contactPerson: 'Ananya Sharma',
    city: 'Bengaluru',
    state: 'Karnataka',
    gstNumber: '29AABCB5678H1Z2',
    address: '42 Koramangala 4th Block, 80 Feet Road',
    category: 'IT Services',
    services: ['Cloud Architecture', 'System Administration', 'Managed IT Support'],
    status: 'Active',
    rating: 4.8,
    ratings: { quality: 4.9, delivery: 4.8, pricing: 4.6, communication: 4.8, reliability: 4.9, compliance: 4.8 },
    registrationDate: '2024-02-10'
  },
  {
    _id: 'vnd-003',
    vendorId: 'VND-003',
    vendorName: 'GreenLeaf Office Solutions',
    companyName: 'GreenLeaf Office Solutions LLP',
    email: 'support@greenleaf.test',
    phone: '+91 97003 44523',
    contactPerson: 'Srinivas Reddy',
    city: 'Hyderabad',
    state: 'Telangana',
    gstNumber: '36AABCG9101J1Z8',
    address: '77 Hitec City Main Road, Madhapur',
    category: 'Office Supplies',
    services: ['Ergonomic Seating', 'Printer Cartridges', 'Eco-friendly Stationery'],
    status: 'Active',
    rating: 4.2,
    ratings: { quality: 4.3, delivery: 4.1, pricing: 4.4, communication: 4.0, reliability: 4.2, compliance: 4.2 },
    registrationDate: '2024-03-01'
  },
  {
    _id: 'vnd-004',
    vendorId: 'VND-004',
    vendorName: 'Vertex Logistics',
    companyName: 'Vertex Logistics & Freight',
    email: 'dispatch@vertex.test',
    phone: '+91 98204 55634',
    contactPerson: 'Vikram Mehta',
    city: 'Mumbai',
    state: 'Maharashtra',
    gstNumber: '27AABCV1213K1Z1',
    address: '105 MIDC Industrial Area, Andheri East',
    category: 'Logistics',
    services: ['Express Courier', 'Warehouse Storage', 'Fleet Distribution'],
    status: 'Active',
    rating: 4.4,
    ratings: { quality: 4.5, delivery: 4.6, pricing: 4.1, communication: 4.3, reliability: 4.5, compliance: 4.4 },
    registrationDate: '2024-03-20'
  },
  {
    _id: 'vnd-005',
    vendorId: 'VND-005',
    vendorName: 'PrimeCore Systems',
    companyName: 'PrimeCore Systems India',
    email: 'sales@primecore.test',
    phone: '+91 98505 66745',
    contactPerson: 'Kunal Deshmukh',
    city: 'Pune',
    state: 'Maharashtra',
    gstNumber: '27AABCP1415L1Z4',
    address: '24 Hinjawadi Phase 1, Infotech Park',
    category: 'Hardware',
    services: ['Enterprise Servers', 'Networking Switches', 'Storage Racks'],
    status: 'Active',
    rating: 4.0,
    ratings: { quality: 4.2, delivery: 3.9, pricing: 3.8, communication: 4.1, reliability: 4.0, compliance: 4.0 },
    registrationDate: '2024-04-12'
  },
  {
    _id: 'vnd-006',
    vendorId: 'VND-006',
    vendorName: 'UrbanEdge Facilities',
    companyName: 'UrbanEdge Facilities Management',
    email: 'help@urbanedge.test',
    phone: '+91 94406 77856',
    contactPerson: 'Deepa Sundaram',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    gstNumber: '33AABCU1617M1Z7',
    address: '68 Avinashi Road, Peelamedu',
    category: 'Facility Management',
    services: ['Commercial Cleaning', 'HVAC Maintenance', 'Pest Control Services'],
    status: 'Active',
    rating: 3.9,
    ratings: { quality: 4.0, delivery: 3.8, pricing: 4.1, communication: 3.9, reliability: 3.8, compliance: 3.8 },
    registrationDate: '2024-05-05'
  },
  {
    _id: 'vnd-007',
    vendorId: 'VND-007',
    vendorName: 'NexaTech Solutions',
    companyName: 'NexaTech Solutions Ltd',
    email: 'contact@nexatech.test',
    phone: '+91 98107 88967',
    contactPerson: 'Rohan Mehra',
    city: 'Gurugram',
    state: 'Haryana',
    gstNumber: '06AABCN1819N1Z0',
    address: '15 Cyber City, DLF Phase 2',
    category: 'Software',
    services: ['SaaS Development', 'QA Automation', 'API Integrations'],
    status: 'Active',
    rating: 4.7,
    ratings: { quality: 4.8, delivery: 4.7, pricing: 4.5, communication: 4.8, reliability: 4.7, compliance: 4.7 },
    registrationDate: '2024-05-22'
  },
  {
    _id: 'vnd-008',
    vendorId: 'VND-008',
    vendorName: 'Matrix Security Corp',
    companyName: 'Matrix Industrial Security',
    email: 'security@matrix.test',
    phone: '+91 98808 99078',
    contactPerson: 'Sunil Nair',
    city: 'Bengaluru',
    state: 'Karnataka',
    gstNumber: '29AABCM2021P1Z3',
    address: '88 Electronic City Phase 1, Hosur Road',
    category: 'Security Services',
    services: ['CCTV Monitoring', 'Biometric Access Control', 'Physical Security Guards'],
    status: 'Active',
    rating: 4.3,
    ratings: { quality: 4.4, delivery: 4.2, pricing: 4.3, communication: 4.2, reliability: 4.3, compliance: 4.4 },
    registrationDate: '2024-06-10'
  },
  {
    _id: 'vnd-009',
    vendorId: 'VND-009',
    vendorName: 'Zenith Manufacturing',
    companyName: 'Zenith Precision Components',
    email: 'orders@zenithmfg.test',
    phone: '+91 98209 11289',
    contactPerson: 'Pradeep Joshi',
    city: 'Ahmedabad',
    state: 'Gujarat',
    gstNumber: '24AABCZ2223Q1Z6',
    address: '55 GIDC Industrial Estate, Vatva',
    category: 'Manufacturing',
    services: ['Sheet Metal Fabrication', 'CNC Machining', 'Custom Tooling'],
    status: 'Active',
    rating: 4.1,
    ratings: { quality: 4.3, delivery: 3.9, pricing: 4.2, communication: 4.0, reliability: 4.1, compliance: 4.1 },
    registrationDate: '2024-06-25'
  },
  {
    _id: 'vnd-010',
    vendorId: 'VND-010',
    vendorName: 'CloudWave Infotech',
    companyName: 'CloudWave Infotech Pvt Ltd',
    email: 'info@cloudwave.test',
    phone: '+91 98401 22390',
    contactPerson: 'Meera Krishnan',
    city: 'Chennai',
    state: 'Tamil Nadu',
    gstNumber: '33AABCC2425R1Z9',
    address: '33 OMR IT Expressway, Thoraipakkam',
    category: 'Cloud Services',
    services: ['AWS Managed Services', 'Azure DevOps', 'Kubernetes Clusters'],
    status: 'Active',
    rating: 4.9,
    ratings: { quality: 5.0, delivery: 4.9, pricing: 4.6, communication: 4.9, reliability: 5.0, compliance: 4.9 },
    registrationDate: '2024-07-02'
  }
];

let contracts = [
  {
    _id: 'cnt-001',
    contractNumber: 'CNT-2024-001',
    title: 'Enterprise Stationery & Paper Agreement',
    vendor: vendors[0],
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    value: 1250000,
    status: 'Active',
    slaScore: 96,
    terms: 'Net 30 payment terms, 98% on-time fulfilment SLA.'
  },
  {
    _id: 'cnt-002',
    contractNumber: 'CNT-2024-002',
    title: 'Managed IT Infrastructure & Cloud SLA',
    vendor: vendors[1],
    startDate: '2024-02-01',
    endDate: '2026-01-31',
    value: 4800000,
    status: 'Active',
    slaScore: 99,
    terms: '99.9% uptime SLA, 15-minute response on P1 incidents.'
  },
  {
    _id: 'cnt-003',
    contractNumber: 'CNT-2024-003',
    title: 'Nationwide Logistics Master Service Agreement',
    vendor: vendors[3],
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    value: 2400000,
    status: 'Expiring Soon',
    slaScore: 91,
    terms: '48-hour delivery across metro clusters.'
  },
  {
    _id: 'cnt-004',
    contractNumber: 'CNT-2024-004',
    title: 'Corporate Campus Facilities & HVAC Maintenance',
    vendor: vendors[5],
    startDate: '2024-05-01',
    endDate: '2025-04-30',
    value: 1800000,
    status: 'Active',
    slaScore: 88,
    terms: 'Monthly HVAC filter replacement and certified pest control audit.'
  },
  {
    _id: 'cnt-005',
    contractNumber: 'CNT-2024-005',
    title: 'Enterprise Cloud Hosting & Kubernetes Cluster SLA',
    vendor: vendors[9],
    startDate: '2024-07-01',
    endDate: '2026-06-30',
    value: 6500000,
    status: 'Active',
    slaScore: 99.4,
    terms: 'Continuous multi-region replication and dedicated DevOps desk.'
  }
];

let orders = [
  {
    _id: 'ord-001',
    orderNumber: 'PO-2026-001',
    vendor: vendors[0],
    items: [{ name: 'A4 Copier Paper Bulk Carton', quantity: 50, price: 950 }],
    totalAmount: 47500,
    status: 'Delivered',
    orderDate: '2026-01-10',
    expectedDelivery: '2026-01-14',
    deliveryDate: '2026-01-13'
  },
  {
    _id: 'ord-002',
    orderNumber: 'PO-2026-002',
    vendor: vendors[1],
    items: [{ name: 'Quarterly Laptop Diagnostics (50 units)', quantity: 1, price: 92500 }],
    totalAmount: 92500,
    status: 'Delivered',
    orderDate: '2026-01-15',
    expectedDelivery: '2026-01-20',
    deliveryDate: '2026-01-19'
  },
  {
    _id: 'ord-003',
    orderNumber: 'PO-2026-003',
    vendor: vendors[3],
    items: [{ name: 'Inter-State Logistics Freight Batch', quantity: 4, price: 35000 }],
    totalAmount: 140000,
    status: 'Approved',
    orderDate: '2026-02-05',
    expectedDelivery: '2026-02-12'
  },
  {
    _id: 'ord-004',
    orderNumber: 'PO-2026-004',
    vendor: vendors[4],
    items: [{ name: 'Enterprise 24-Port Gigabit Switch', quantity: 6, price: 28000 }],
    totalAmount: 168000,
    status: 'Pending',
    orderDate: '2026-02-18',
    expectedDelivery: '2026-02-28'
  },
  {
    _id: 'ord-005',
    orderNumber: 'PO-2026-005',
    vendor: vendors[9],
    items: [{ name: 'Cloud Dedicated Node Deployment', quantity: 2, price: 65000 }],
    totalAmount: 130000,
    status: 'Approved',
    orderDate: '2026-02-20',
    expectedDelivery: '2026-02-25'
  }
];

const rawInvoiceConfigs = [
  // 21 Paid
  { id: 'INV-2001', vIdx: 0, po: 'PO-1026', cat: 'Office Supplies', amt: 42500, st: 'Paid', daysAgo: 50, note: 'Bulk A4 copier paper and desk stationery dispatch', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2002', vIdx: 1, po: 'PO-1027', cat: 'IT Services', amt: 37000, st: 'Paid', daysAgo: 45, note: 'Quarterly enterprise laptop diagnostics and thermal service', method: 'RTGS Transfer' },
  { id: 'INV-2003', vIdx: 2, po: 'PO-1030', cat: 'Office Supplies', amt: 51200, st: 'Paid', daysAgo: 40, note: 'High-yield toner cartridges for corporate branch printers', method: 'Corporate Card' },
  { id: 'INV-2004', vIdx: 3, po: 'PO-1033', cat: 'Logistics', amt: 126000, st: 'Paid', daysAgo: 38, note: 'Multi-state logistics freight haul and warehouse palleting', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2005', vIdx: 4, po: 'PO-1004', cat: 'Hardware', amt: 28400, st: 'Paid', daysAgo: 35, note: 'Network server rack rails and CAT-6 patch cords', method: 'RTGS Transfer' },
  { id: 'INV-2006', vIdx: 5, po: 'PO-1034', cat: 'Facility Management', amt: 44000, st: 'Paid', daysAgo: 32, note: 'Corporate facility deep cleaning and HVAC filter change', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2007', vIdx: 6, po: 'PO-1031', cat: 'Software', amt: 95000, st: 'Paid', daysAgo: 30, note: 'Custom React & Node.js software sprint development milestone', method: 'RTGS Transfer' },
  { id: 'INV-2008', vIdx: 7, po: 'PO-1032', cat: 'Security Services', amt: 75000, st: 'Paid', daysAgo: 28, note: 'Biometric gate access integration & security personnel deployment', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2009', vIdx: 8, po: 'PO-1036', cat: 'Manufacturing', amt: 82500, st: 'Paid', daysAgo: 25, note: 'Precision sheet metal brackets and custom CNC milling batch', method: 'RTGS Transfer' },
  { id: 'INV-2010', vIdx: 9, po: 'PO-1028', cat: 'Cloud Services', amt: 90000, st: 'Paid', daysAgo: 22, note: 'Monthly Kubernetes cloud cluster hosting and disaster recovery', method: 'Corporate Card' },
  { id: 'INV-2011', vIdx: 10, po: 'PO-1037', cat: 'Marketing', amt: 76200, st: 'Paid', daysAgo: 20, note: 'Corporate brand collateral, print banners, and UI design assets', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2012', vIdx: 11, po: 'PO-1029', cat: 'Consulting', amt: 64000, st: 'Paid', daysAgo: 18, note: 'Supply chain audit and ESG procurement compliance advisory', method: 'RTGS Transfer' },
  { id: 'INV-2013', vIdx: 0, po: 'PO-1021', cat: 'Office Supplies', amt: 34000, st: 'Paid', daysAgo: 16, note: 'Executive meeting room stationery and whiteboard accessories', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2014', vIdx: 1, po: 'PO-1022', cat: 'IT Services', amt: 37000, st: 'Paid', daysAgo: 14, note: 'Workstation OS hardening and cybersecurity endpoint audit', method: 'RTGS Transfer' },
  { id: 'INV-2015', vIdx: 2, po: 'PO-1023', cat: 'Office Supplies', amt: 64000, st: 'Paid', daysAgo: 12, note: 'Ergonomic lumbar support chairs and desk monitor arms', method: 'Corporate Card' },
  { id: 'INV-2016', vIdx: 4, po: 'PO-1024', cat: 'Hardware', amt: 56800, st: 'Paid', daysAgo: 10, note: 'Gigabit PoE switches and wireless gateway controllers', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2017', vIdx: 6, po: 'PO-1012', cat: 'Software', amt: 95000, st: 'Paid', daysAgo: 8, note: 'Vendor portal API integration and automated webhook pipeline', method: 'RTGS Transfer' },
  { id: 'INV-2018', vIdx: 7, po: 'PO-1013', cat: 'Security Services', amt: 75000, st: 'Paid', daysAgo: 6, note: 'Campus perimeter CCTV maintenance and guard patrol audit', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2019', vIdx: 9, po: 'PO-1009', cat: 'Cloud Services', amt: 45000, st: 'Paid', daysAgo: 5, note: 'Cloud database auto-scaling tier and automated snapshot service', method: 'Corporate Card' },
  { id: 'INV-2020', vIdx: 10, po: 'PO-1025', cat: 'Marketing', amt: 84000, st: 'Paid', daysAgo: 4, note: 'Product release video promo production and digital exhibition deck', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2021', vIdx: 11, po: 'PO-1010', cat: 'Consulting', amt: 32000, st: 'Paid', daysAgo: 2, note: 'Quarterly vendor SLA performance scorecard review and benchmarking', method: 'RTGS Transfer' },

  // 7 Pending
  { id: 'INV-2022', vIdx: 0, po: 'PO-1001', cat: 'Office Supplies', amt: 17000, st: 'Pending', daysAhead: 15, note: 'A4 printing paper reams for accounting audit department', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2023', vIdx: 1, po: 'PO-1002', cat: 'IT Services', amt: 18500, st: 'Pending', daysAhead: 18, note: 'Field technician on-site network cabling maintenance', method: 'RTGS Transfer' },
  { id: 'INV-2024', vIdx: 2, po: 'PO-1003', cat: 'Office Supplies', amt: 38400, st: 'Pending', daysAhead: 20, note: 'Eco-friendly office notebooks, markers, and archival boxes', method: 'Corporate Card' },
  { id: 'INV-2025', vIdx: 3, po: 'PO-1005', cat: 'Logistics', amt: 84000, st: 'Pending', daysAhead: 22, note: 'Temperature-monitored refrigerated pharmaceutical freight', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2026', vIdx: 4, po: 'PO-1008', cat: 'Hardware', amt: 76200, st: 'Pending', daysAhead: 25, note: 'Core 10Gbps enterprise aggregation switch and SFP+ modules', method: 'RTGS Transfer' },
  { id: 'INV-2027', vIdx: 5, po: 'PO-1014', cat: 'Facility Management', amt: 44000, st: 'Pending', daysAhead: 28, note: 'Quarterly pest control and washroom hygiene replenishment', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2028', vIdx: 8, po: 'PO-1007', cat: 'Manufacturing', amt: 33000, st: 'Pending', daysAhead: 30, note: 'Steel chassis covers and custom fabricated metal panels', method: 'RTGS Transfer' },

  // 4 Overdue
  { id: 'INV-2029', vIdx: 3, po: 'PO-1038', cat: 'Logistics', amt: 46500, st: 'Overdue', daysAgo: 22, note: 'Urgent weekend express courier dispatch across branches', method: 'NEFT / Bank Transfer' },
  { id: 'INV-2030', vIdx: 7, po: 'PO-1041', cat: 'Security Services', amt: 65000, st: 'Overdue', daysAgo: 15, note: 'Visitor registration kiosk hardware and thermal scanner replacement', method: 'RTGS Transfer' },
  { id: 'INV-2031', vIdx: 3, po: 'PO-1014', cat: 'Logistics', amt: 38000, st: 'Overdue', daysAgo: 12, note: 'Dedicated container haul from Chennai port to warehouse', method: 'Corporate Card' },
  { id: 'INV-2032', vIdx: 5, po: 'PO-1015', cat: 'Facility Management', amt: 19500, st: 'Overdue', daysAgo: 9, note: 'Cafeteria sanitation audit and grease trap maintenance service', method: 'NEFT / Bank Transfer' },

  // 3 Rejected
  { id: 'INV-2033', vIdx: 4, po: 'PO-1042', cat: 'Hardware', amt: 168000, st: 'Rejected', daysAgo: 14, note: 'Disputed rate discrepancy for unapproved enterprise server parts', method: 'RTGS Transfer' },
  { id: 'INV-2034', vIdx: 9, po: 'PO-1039', cat: 'Cloud Services', amt: 115000, st: 'Rejected', daysAgo: 18, note: 'Excess egress bandwidth charges disputed by infrastructure team', method: 'Corporate Card' },
  { id: 'INV-2035', vIdx: 7, po: 'PO-1040', cat: 'Security Services', amt: 96000, st: 'Rejected', daysAgo: 25, note: 'Invoice rejected due to missing physical timesheets from security vendor', method: 'NEFT / Bank Transfer' }
];

const nowTs = Date.now();
let invoices = rawInvoiceConfigs.map((cfg, idx) => {
  const v = vendors[cfg.vIdx % vendors.length];
  const tax = Math.round(cfg.amt * 0.18);
  const total = cfg.amt + tax;
  let invDateStr, dueDateStr, paidDateStr;

  if (cfg.daysAhead) {
    const invD = new Date(nowTs - 5 * 86400000);
    const dueD = new Date(nowTs + cfg.daysAhead * 86400000);
    invDateStr = invD.toISOString().slice(0, 10);
    dueDateStr = dueD.toISOString().slice(0, 10);
  } else {
    const dueD = new Date(nowTs - cfg.daysAgo * 86400000);
    const invD = new Date(dueD.getTime() - 30 * 86400000);
    invDateStr = invD.toISOString().slice(0, 10);
    dueDateStr = dueD.toISOString().slice(0, 10);
    if (cfg.st === 'Paid') {
      const paidD = new Date(dueD.getTime() - 2 * 86400000);
      paidDateStr = paidD.toISOString().slice(0, 10);
    }
  }

  return {
    _id: `inv-${2001 + idx}`,
    invoiceNumber: cfg.id,
    orderId: cfg.po,
    vendor: v,
    vendorId: v.vendorId,
    vendorName: v.companyName,
    category: cfg.cat || v.category,
    amount: cfg.amt,
    tax,
    total,
    paymentStatus: cfg.st,
    status: cfg.st,
    invoiceDate: invDateStr,
    dueDate: dueDateStr,
    paidDate: paidDateStr,
    paymentMethod: cfg.method,
    notes: cfg.note
  };
});

const products = [
  { _id: 'p-01', productId: 'PRD-101', name: 'Office Stationery Package', category: 'Office Supplies', price: 8500, quantity: 120, vendor: vendors[0], status: 'Available' },
  { _id: 'p-02', productId: 'PRD-102', name: 'Laptop Maintenance Service', category: 'IT Services', price: 18500, quantity: 45, vendor: vendors[1], status: 'Available' },
  { _id: 'p-03', productId: 'PRD-103', name: 'Cloud Hosting & Storage SLA', category: 'Cloud Services', price: 45000, quantity: 60, vendor: vendors[9], status: 'Available' },
  { _id: 'p-04', productId: 'PRD-104', name: 'Network Installation & Cabling', category: 'Hardware', price: 32000, quantity: 25, vendor: vendors[4], status: 'Available' },
  { _id: 'p-05', productId: 'PRD-105', name: 'High-Yield Printer Toner Supplies', category: 'Office Supplies', price: 12800, quantity: 85, vendor: vendors[2], status: 'Available' }
];

let activities = [
  { _id: 'act-1', type: 'order', title: 'New PO Issued', description: 'PO-2026-005 dispatched to CloudWave Infotech', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { _id: 'act-2', type: 'payment', title: 'Payment Settled', description: '₹1,09,150 cleared for BluePeak Technologies', timestamp: new Date(Date.now() - 95 * 60000).toISOString() },
  { _id: 'act-3', type: 'contract', title: 'Contract Renewal', description: 'Cloud SLA Extended through 2026', timestamp: new Date(Date.now() - 180 * 60000).toISOString() },
  { _id: 'act-4', type: 'vendor', title: 'Compliance Audit Passed', description: 'Northstar Supplies passed ISO-9001 review', timestamp: new Date(Date.now() - 360 * 60000).toISOString() }
];

// Router for all API routes
const router = express.Router();

let users = [
  {
    _id: 'usr-admin-001',
    id: 'usr-admin-001',
    name: 'Kathir Sanjay',
    email: 'admin@vendom.com',
    role: 'admin',
    vendor: null,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: 'usr-admin-002',
    id: 'usr-admin-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@vendom.com',
    role: 'admin',
    vendor: null,
    createdAt: '2024-01-10T00:00:00.000Z'
  },
  {
    _id: 'usr-admin-003',
    id: 'usr-admin-003',
    name: 'Arun Kumar',
    email: 'arun.kumar@vendom.com',
    role: 'admin',
    vendor: null,
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: 'usr-vnd-001',
    id: 'usr-vnd-001',
    name: 'Rajesh Raman',
    email: 'vendor@northstar.test',
    role: 'vendor',
    vendor: {
      _id: 'vnd-001',
      vendorId: 'VND-001',
      vendorName: 'Northstar Supplies',
      companyName: 'Northstar Supplies Ltd.'
    },
    createdAt: '2024-02-01T00:00:00.000Z'
  },
  {
    _id: 'usr-vnd-002',
    id: 'usr-vnd-002',
    name: 'Ananya Sharma',
    email: 'tech@bluepeak.test',
    role: 'vendor',
    vendor: {
      _id: 'vnd-002',
      vendorId: 'VND-002',
      vendorName: 'BluePeak Technologies',
      companyName: 'BluePeak Technologies Pvt Ltd'
    },
    createdAt: '2024-02-05T00:00:00.000Z'
  },
  {
    _id: 'usr-vnd-003',
    id: 'usr-vnd-003',
    name: 'Vikram Mehta',
    email: 'dispatch@vertex.test',
    role: 'vendor',
    vendor: {
      _id: 'vnd-004',
      vendorId: 'VND-004',
      vendorName: 'Vertex Logistics',
      companyName: 'Vertex Logistics Corp'
    },
    createdAt: '2024-02-12T00:00:00.000Z'
  }
];

// Health check
router.get('/health', (_req, res) => res.json({ status: 'ok', serverless: true, timestamp: new Date().toISOString() }));

// Auth
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const cleanEmail = (email || '').trim().toLowerCase();

  // 1. Vendor Demo Accounts
  if (
    cleanEmail === 'vendor@northstar.test' ||
    cleanEmail === 'vendor@northstar.com' ||
    cleanEmail === 'vendor@vendom.com' ||
    cleanEmail === 'vendor' ||
    (cleanEmail.includes('vendor') && (password === 'vendor123' || password === 'vendor' || password === '123' || password === 'admin123'))
  ) {
    const user = users.find((u) => u.email === 'vendor@northstar.test') || {
      _id: 'usr-vnd-001',
      id: 'usr-vnd-001',
      name: 'Rajesh Raman',
      email: cleanEmail || 'vendor@northstar.test',
      role: 'vendor',
      vendor: {
        _id: 'vnd-001',
        vendorId: 'VND-001',
        vendorName: 'Northstar Supplies',
        companyName: 'Northstar Supplies Ltd.'
      }
    };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  }

  if (cleanEmail === 'tech@bluepeak.test' || cleanEmail === 'tech@bluepeak.com' || cleanEmail.includes('bluepeak')) {
    const user = users.find((u) => u.email === 'tech@bluepeak.test') || {
      _id: 'usr-vnd-002',
      id: 'usr-vnd-002',
      name: 'Ananya Sharma',
      email: cleanEmail,
      role: 'vendor',
      vendor: {
        _id: 'vnd-002',
        vendorId: 'VND-002',
        vendorName: 'BluePeak Technologies',
        companyName: 'BluePeak Technologies Pvt Ltd'
      }
    };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  }

  if (cleanEmail === 'dispatch@vertex.test' || cleanEmail === 'dispatch@vertex.com' || cleanEmail.includes('vertex')) {
    const user = users.find((u) => u.email === 'dispatch@vertex.test') || {
      _id: 'usr-vnd-003',
      id: 'usr-vnd-003',
      name: 'Vikram Mehta',
      email: cleanEmail,
      role: 'vendor',
      vendor: {
        _id: 'vnd-004',
        vendorId: 'VND-004',
        vendorName: 'Vertex Logistics',
        companyName: 'Vertex Logistics Corp'
      }
    };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  }

  // 2. Admin Demo Accounts
  if (
    cleanEmail === 'admin@vendom.com' ||
    cleanEmail === 'admin@123' ||
    cleanEmail === 'admin' ||
    (cleanEmail.includes('admin') && (password === 'admin123' || password === 'admin' || password === '123' || password === 'admin@123'))
  ) {
    const user = { id: 'usr-admin-001', name: 'Kathir Sanjay', email: cleanEmail || 'admin@vendom.com', role: 'admin' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  }

  if (password === 'admin123' || password === 'vendor123' || !password) {
    const isVendor = cleanEmail.includes('vendor') || password === 'vendor123';
    const role = isVendor ? 'vendor' : 'admin';
    const user = {
      id: isVendor ? 'usr-vnd-001' : 'usr-admin-001',
      name: isVendor ? 'Rajesh Raman' : 'Kathir Sanjay',
      email: cleanEmail,
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
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  }

  res.status(401).json({ message: 'Invalid credentials. Use demo login: admin@vendom.com / admin123 or vendor@northstar.test / vendor123' });
});

router.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
      if (decoded && decoded.email) {
        const found = users.find((u) => u.email === decoded.email) || decoded;
        return res.json({ user: found });
      }
    } catch (_e) {}
  }
  const user = { id: 'usr-admin-001', name: 'Kathir Sanjay', email: 'admin@vendom.com', role: 'admin' };
  res.json({ user });
});

// Dashboard
router.get('/dashboard', (_req, res) => {
  res.json({
    vendors: {
      total: vendors.length,
      active: vendors.filter((v) => v.status === 'Active').length,
      pending: vendors.filter((v) => v.status === 'Pending').length,
      suspended: vendors.filter((v) => v.status === 'Suspended').length,
      inactive: vendors.filter((v) => v.status === 'Inactive').length
    },
    contracts: {
      total: contracts.length,
      active: contracts.filter((c) => c.status === 'Active').length,
      expiringSoon: contracts.filter((c) => c.status === 'Expiring Soon').length,
      expired: contracts.filter((c) => c.status === 'Expired').length,
      draft: contracts.filter((c) => c.status === 'Draft').length
    },
    orders: {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'Pending').length,
      approved: orders.filter((o) => o.status === 'Approved').length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length
    },
    invoices: {
      total: invoices.length,
      paid: invoices.filter((i) => i.status === 'Paid').length,
      pending: invoices.filter((i) => i.status === 'Pending').length,
      overdue: invoices.filter((i) => i.status === 'Overdue').length
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
    recentActivities: activities
  });
});

// Vendors
router.get('/vendors', (req, res) => {
  let result = [...vendors];
  const { search, category, status } = req.query;
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((v) => (v.vendorName || '').toLowerCase().includes(q) || (v.vendorId || '').toLowerCase().includes(q));
  }
  if (category && category !== 'All') result = result.filter((v) => v.category === category);
  if (status && status !== 'All') result = result.filter((v) => v.status === status);
  res.json(result);
});

router.post('/vendors', (req, res) => {
  const newV = {
    _id: 'vnd-' + Date.now(),
    vendorId: `VND-0${vendors.length + 1}`,
    rating: 4.5,
    registrationDate: new Date().toISOString().slice(0, 10),
    ...req.body
  };
  vendors.unshift(newV);
  res.status(201).json(newV);
});

router.put('/vendors/:id', (req, res) => {
  const idx = vendors.findIndex((v) => v._id === req.params.id || v.vendorId === req.params.id);
  if (idx !== -1) {
    vendors[idx] = { ...vendors[idx], ...req.body };
    return res.json(vendors[idx]);
  }
  res.status(404).json({ message: 'Vendor not found' });
});

router.delete('/vendors/:id', (req, res) => {
  vendors = vendors.filter((v) => v._id !== req.params.id && v.vendorId !== req.params.id);
  res.json({ success: true });
});

// Contracts
router.get('/contracts', (_req, res) => res.json(contracts));
router.post('/contracts', (req, res) => {
  const newC = {
    _id: 'cnt-' + Date.now(),
    contractNumber: `CNT-2026-00${contracts.length + 1}`,
    slaScore: 95,
    ...req.body
  };
  contracts.unshift(newC);
  res.status(201).json(newC);
});

// Orders
router.get('/orders', (_req, res) => res.json(orders));
router.post('/orders', (req, res) => {
  const newO = {
    _id: 'ord-' + Date.now(),
    orderNumber: `PO-2026-00${orders.length + 1}`,
    orderDate: new Date().toISOString().slice(0, 10),
    status: 'Pending',
    ...req.body
  };
  orders.unshift(newO);
  res.status(201).json(newO);
});

// Invoices
router.get('/invoices', (req, res) => {
  let result = [...invoices];
  const { search, status } = req.query;
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (i) =>
        (i.invoiceNumber || '').toLowerCase().includes(q) ||
        (i.orderId || '').toLowerCase().includes(q) ||
        (i.vendor?.companyName || i.vendorName || '').toLowerCase().includes(q)
    );
  }
  if (status && status !== 'All') {
    result = result.filter((i) => (i.paymentStatus || i.status) === status);
  }
  res.json(result);
});

router.post('/invoices', (req, res) => {
  const amt = Number(req.body.amount) || 0;
  const tax = Math.round(amt * 0.18);
  const newI = {
    _id: 'inv-' + Date.now(),
    invoiceNumber: req.body.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: amt,
    tax,
    total: amt + tax,
    paymentStatus: req.body.paymentStatus || 'Pending',
    status: req.body.paymentStatus || 'Pending',
    invoiceDate: req.body.invoiceDate || new Date().toISOString().slice(0, 10),
    dueDate: req.body.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
    paymentMethod: req.body.paymentMethod || 'NEFT / Bank Transfer',
    notes: req.body.notes || 'Vendor procurement milestone payment',
    ...req.body
  };
  invoices.unshift(newI);
  res.status(201).json(newI);
});

router.patch('/invoices/:id/status', (req, res) => {
  const idx = invoices.findIndex((i) => i._id === req.params.id || i.invoiceNumber === req.params.id);
  if (idx !== -1) {
    const status = req.body.paymentStatus || req.body.status || 'Paid';
    invoices[idx].paymentStatus = status;
    invoices[idx].status = status;
    if (status === 'Paid') invoices[idx].paidDate = new Date().toISOString().slice(0, 10);
    return res.json(invoices[idx]);
  }
  res.status(404).json({ message: 'Invoice not found' });
});

router.put('/invoices/:id', (req, res) => {
  const idx = invoices.findIndex((i) => i._id === req.params.id || i.invoiceNumber === req.params.id);
  if (idx !== -1) {
    const amt = Number(req.body.amount) || invoices[idx].amount;
    const tax = Math.round(amt * 0.18);
    invoices[idx] = {
      ...invoices[idx],
      ...req.body,
      amount: amt,
      tax,
      total: amt + tax
    };
    return res.json(invoices[idx]);
  }
  res.status(404).json({ message: 'Invoice not found' });
});

router.delete('/invoices/:id', (req, res) => {
  invoices = invoices.filter((i) => i._id !== req.params.id && i.invoiceNumber !== req.params.id);
  res.json({ success: true });
});

// Products & Activities
router.get('/products', (_req, res) => res.json(products));
router.get('/activities', (_req, res) => res.json(activities));

// Users
router.get('/users', (req, res) => {
  let result = [...users];
  const { search, role } = req.query;
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((u) => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
  }
  if (role && role !== 'All') {
    result = result.filter((u) => u.role === role);
  }
  res.json(result);
});

router.post('/users', (req, res) => {
  const newU = {
    _id: 'usr-' + Date.now(),
    id: 'usr-' + Date.now(),
    createdAt: new Date().toISOString(),
    ...req.body
  };
  users.unshift(newU);
  res.status(201).json(newU);
});

router.put('/users/:id', (req, res) => {
  const idx = users.findIndex((u) => u._id === req.params.id || u.id === req.params.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...req.body };
    return res.json(users[idx]);
  }
  res.status(404).json({ message: 'User not found' });
});

router.delete('/users/:id', (req, res) => {
  users = users.filter((u) => u._id !== req.params.id && u.id !== req.params.id);
  res.json({ success: true });
});

// Mount router on both /api and / for resilient routing in Vercel
app.use('/api', router);
app.use('/', router);

export default app;
