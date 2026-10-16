// Built-in Demo Mock Store for Standalone Client & Vercel Deployments

const initialVendors = [
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
  },
  {
    _id: 'vnd-011',
    vendorId: 'VND-011',
    vendorName: 'Apex Creative Studio',
    companyName: 'Apex Design & Advertising LLP',
    email: 'hello@apexstudio.test',
    phone: '+91 98102 33401',
    contactPerson: 'Tanvi Kapoor',
    city: 'New Delhi',
    state: 'Delhi',
    gstNumber: '07AABCA2627S1Z2',
    address: '9 Hauz Khas Village, Sri Aurobindo Marg',
    category: 'Marketing',
    services: ['Brand Identity', 'Product UI/UX', 'Video Production'],
    status: 'Active',
    rating: 4.5,
    ratings: { quality: 4.7, delivery: 4.4, pricing: 4.3, communication: 4.6, reliability: 4.5, compliance: 4.5 },
    registrationDate: '2024-07-15'
  },
  {
    _id: 'vnd-012',
    vendorId: 'VND-012',
    vendorName: 'Starlight Consulting',
    companyName: 'Starlight Management Advisory',
    email: 'advisory@starlight.test',
    phone: '+91 98803 44512',
    contactPerson: 'Harish Bhatt',
    city: 'Bengaluru',
    state: 'Karnataka',
    gstNumber: '29AABCS2829T1Z5',
    address: '100 Residency Road, Shanthala Nagar',
    category: 'Consulting',
    services: ['Supply Chain Optimization', 'ESG Compliance', 'Procurement Strategy'],
    status: 'Active',
    rating: 4.4,
    ratings: { quality: 4.6, delivery: 4.3, pricing: 4.2, communication: 4.5, reliability: 4.4, compliance: 4.6 },
    registrationDate: '2024-08-01'
  },
  {
    _id: 'vnd-013',
    vendorId: 'VND-013',
    vendorName: 'SpeedyShip Express',
    companyName: 'SpeedyShip Express Logistics',
    email: 'ops@speedyship.test',
    phone: '+91 98205 55623',
    contactPerson: 'Gaurav Kulkarni',
    city: 'Pune',
    state: 'Maharashtra',
    gstNumber: '27AABCS3031U1Z8',
    address: '12 Nagar Road, Viman Nagar',
    category: 'Logistics',
    services: ['Same-day B2B Dispatch', 'Temperature-controlled Transport'],
    status: 'Pending',
    rating: 3.8,
    ratings: { quality: 3.9, delivery: 3.7, pricing: 4.0, communication: 3.8, reliability: 3.7, compliance: 3.8 },
    registrationDate: '2024-08-18'
  },
  {
    _id: 'vnd-014',
    vendorId: 'VND-014',
    vendorName: 'SwiftFab Works',
    companyName: 'Swift Precision Fabricators',
    email: 'info@swiftfab.test',
    phone: '+91 97006 66734',
    contactPerson: 'Manish Gupta',
    city: 'Hyderabad',
    state: 'Telangana',
    gstNumber: '36AABCS3233V1Z1',
    address: '88 Cherlapally Industrial Area',
    category: 'Manufacturing',
    services: ['Custom Metal Enclosures', 'Injection Molding'],
    status: 'Pending',
    rating: 4.0,
    ratings: { quality: 4.1, delivery: 3.9, pricing: 4.1, communication: 3.9, reliability: 4.0, compliance: 4.0 },
    registrationDate: '2024-09-01'
  },
  {
    _id: 'vnd-015',
    vendorId: 'VND-015',
    vendorName: 'Horizon Facilities Group',
    companyName: 'Horizon Facilities & Catering',
    email: 'care@horizonfac.test',
    phone: '+91 98407 77845',
    contactPerson: 'Kavitha Iyer',
    city: 'Chennai',
    state: 'Tamil Nadu',
    gstNumber: '33AABCH3435W1Z4',
    address: '22 Velachery Bypass Road',
    category: 'Facility Management',
    services: ['Corporate Cafeteria Management', 'Office Housekeeping'],
    status: 'Pending',
    rating: 3.7,
    ratings: { quality: 3.8, delivery: 3.6, pricing: 3.9, communication: 3.7, reliability: 3.7, compliance: 3.7 },
    registrationDate: '2024-09-15'
  }
];

const initialContracts = [
  {
    _id: 'cnt-001',
    contractNumber: 'CNT-2024-001',
    title: 'Enterprise Stationery & Paper Agreement',
    vendor: initialVendors[0],
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
    vendor: initialVendors[1],
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
    vendor: initialVendors[3],
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
    vendor: initialVendors[5],
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
    vendor: initialVendors[9],
    startDate: '2024-07-01',
    endDate: '2026-06-30',
    value: 6500000,
    status: 'Active',
    slaScore: 99.4,
    terms: 'Continuous multi-region replication and dedicated DevOps desk.'
  }
];

const initialOrders = [
  {
    _id: 'ord-001',
    orderNumber: 'PO-2026-001',
    vendor: initialVendors[0],
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
    vendor: initialVendors[1],
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
    vendor: initialVendors[3],
    items: [{ name: 'Inter-State Logistics Freight Batch', quantity: 4, price: 35000 }],
    totalAmount: 140000,
    status: 'Approved',
    orderDate: '2026-02-05',
    expectedDelivery: '2026-02-12'
  },
  {
    _id: 'ord-004',
    orderNumber: 'PO-2026-004',
    vendor: initialVendors[4],
    items: [{ name: 'Enterprise 24-Port Gigabit Switch', quantity: 6, price: 28000 }],
    totalAmount: 168000,
    status: 'Pending',
    orderDate: '2026-02-18',
    expectedDelivery: '2026-02-28'
  },
  {
    _id: 'ord-005',
    orderNumber: 'PO-2026-005',
    vendor: initialVendors[9],
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
const initialInvoices = rawInvoiceConfigs.map((cfg, idx) => {
  const v = initialVendors[cfg.vIdx % initialVendors.length];
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

const initialProducts = [
  { _id: 'p-01', productId: 'PRD-101', name: 'Office Stationery Package', category: 'Office Supplies', price: 8500, quantity: 120, vendor: initialVendors[0], status: 'Available' },
  { _id: 'p-02', productId: 'PRD-102', name: 'Laptop Maintenance Service', category: 'IT Services', price: 18500, quantity: 45, vendor: initialVendors[1], status: 'Available' },
  { _id: 'p-03', productId: 'PRD-103', name: 'Cloud Hosting & Storage SLA', category: 'Cloud Services', price: 45000, quantity: 60, vendor: initialVendors[9], status: 'Available' },
  { _id: 'p-04', productId: 'PRD-104', name: 'Network Installation & Cabling', category: 'Hardware', price: 32000, quantity: 25, vendor: initialVendors[4], status: 'Available' },
  { _id: 'p-05', productId: 'PRD-105', name: 'High-Yield Printer Toner Supplies', category: 'Office Supplies', price: 12800, quantity: 85, vendor: initialVendors[2], status: 'Available' }
];

const initialActivities = [
  { _id: 'act-1', type: 'order', title: 'New PO Issued', description: 'PO-2026-005 dispatched to CloudWave Infotech', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { _id: 'act-2', type: 'payment', title: 'Payment Settled', description: '₹1,09,150 cleared for BluePeak Technologies', timestamp: new Date(Date.now() - 95 * 60000).toISOString() },
  { _id: 'act-3', type: 'contract', title: 'Contract Renewal', description: 'Cloud SLA Extended through 2026', timestamp: new Date(Date.now() - 180 * 60000).toISOString() },
  { _id: 'act-4', type: 'vendor', title: 'Compliance Audit Passed', description: 'Northstar Supplies passed ISO-9001 review', timestamp: new Date(Date.now() - 360 * 60000).toISOString() }
];

export const initialUsers = [
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

export const demoStore = {
  vendors: [...initialVendors],
  contracts: [...initialContracts],
  orders: [...initialOrders],
  invoices: [...initialInvoices],
  products: [...initialProducts],
  activities: [...initialActivities],
  users: [...initialUsers],
  currentUser: {
    id: 'usr-admin-demo',
    name: 'Kathir Sanjay',
    email: 'admin@vendom.com',
    role: 'admin'
  }
};
