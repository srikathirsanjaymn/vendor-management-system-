import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from './models/User.js';
import Vendor from './models/Vendor.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Contract from './models/Contract.js';
import Invoice from './models/Invoice.js';
import Activity from './models/Activity.js';
import { fileURLToPath } from 'url';

export async function seedAllData() {
  console.log('--- Starting Vendor Management System Demo Seeding ---');

  // 1. Clear existing collections for a clean, deterministic baseline
  await Promise.all([
    User.deleteMany({}),
    Vendor.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Contract.deleteMany({}),
    Invoice.deleteMany({}),
    Activity.deleteMany({})
  ]);

  // 2. Define 20 realistic fictional vendors
  const rawVendors = [
    {
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
      registrationDate: new Date('2024-01-15')
    },
    {
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
      registrationDate: new Date('2024-02-10')
    },
    {
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
      registrationDate: new Date('2024-03-01')
    },
    {
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
      registrationDate: new Date('2024-03-20')
    },
    {
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
      registrationDate: new Date('2024-04-12')
    },
    {
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
      registrationDate: new Date('2024-05-05')
    },
    {
      vendorId: 'VND-007',
      vendorName: 'NexaTech Solutions',
      companyName: 'NexaTech Solutions Ltd',
      email: 'ops@nexatech.test',
      phone: '+91 99007 88967',
      contactPerson: 'Rohan Banerjee',
      city: 'Bengaluru',
      state: 'Karnataka',
      gstNumber: '29AABCN1819N1Z0',
      address: '112 Whitefield Main Road, EPIP Zone',
      category: 'Software',
      services: ['Custom Web Portals', 'API Integrations', 'ERP Customization'],
      status: 'Active',
      rating: 4.7,
      ratings: { quality: 4.8, delivery: 4.7, pricing: 4.5, communication: 4.8, reliability: 4.7, compliance: 4.7 },
      registrationDate: new Date('2024-05-25')
    },
    {
      vendorId: 'VND-008',
      vendorName: 'BrightSource Consulting',
      companyName: 'BrightSource Advisory Group',
      email: 'info@brightsource.test',
      phone: '+91 98108 99078',
      contactPerson: 'Meenakshi Kapoor',
      city: 'Delhi',
      state: 'Delhi NCR',
      gstNumber: '07AABCB2021P1Z3',
      address: '55 Barakhamba Road, Connaught Place',
      category: 'Consulting',
      services: ['Procurement Audits', 'Vendor Compliance Review', 'Strategic Sourcing'],
      status: 'Active',
      rating: 4.5,
      ratings: { quality: 4.6, delivery: 4.5, pricing: 4.2, communication: 4.7, reliability: 4.5, compliance: 4.5 },
      registrationDate: new Date('2024-06-15')
    },
    {
      vendorId: 'VND-009',
      vendorName: 'Apex Industrial Supplies',
      companyName: 'Apex Industrial Supplies Ltd',
      email: 'orders@apexind.test',
      phone: '+91 98409 00189',
      contactPerson: 'Murali Krishnan',
      city: 'Chennai',
      state: 'Tamil Nadu',
      gstNumber: '33AABCA2223Q1Z6',
      address: '89 Ambattur Industrial Estate',
      category: 'Manufacturing',
      services: ['Industrial Toolkits', 'Safety Helmets', 'Protective Workwear'],
      status: 'Active',
      rating: 3.8,
      ratings: { quality: 4.0, delivery: 3.7, pricing: 3.8, communication: 3.7, reliability: 3.8, compliance: 3.8 },
      registrationDate: new Date('2024-07-01')
    },
    {
      vendorId: 'VND-010',
      vendorName: 'CloudBridge Services',
      companyName: 'CloudBridge Networks Pvt Ltd',
      email: 'cloud@cloudbridge.test',
      phone: '+91 97001 11290',
      contactPerson: 'Harish Chandra',
      city: 'Hyderabad',
      state: 'Telangana',
      gstNumber: '36AABCC2425R1Z9',
      address: '33 Financial District, Gachibowli',
      category: 'Cloud Services',
      services: ['DevOps Pipelines', 'Cloud Migration', 'Database Backup Automation'],
      status: 'Active',
      rating: 4.8,
      ratings: { quality: 4.9, delivery: 4.7, pricing: 4.7, communication: 4.8, reliability: 4.9, compliance: 4.8 },
      registrationDate: new Date('2024-07-18')
    },
    {
      vendorId: 'VND-011',
      vendorName: 'SilverLine Components',
      companyName: 'SilverLine Hardware Components',
      email: 'tech@silverline.test',
      phone: '+91 98502 22301',
      contactPerson: 'Tanvi Joshi',
      city: 'Pune',
      state: 'Maharashtra',
      gstNumber: '27AABCS2627S1Z2',
      address: '40 Bhosari Industrial Area',
      category: 'Hardware',
      services: ['RAM Upgrades', 'Solid State Drives', 'Power Supply Units'],
      status: 'Active',
      rating: 4.1,
      ratings: { quality: 4.3, delivery: 4.0, pricing: 4.2, communication: 4.0, reliability: 4.1, compliance: 4.0 },
      registrationDate: new Date('2024-08-05')
    },
    {
      vendorId: 'VND-012',
      vendorName: 'MetroWorks Solutions',
      companyName: 'MetroWorks IT Solutions',
      email: 'contact@metroworks.test',
      phone: '+91 94403 33412',
      contactPerson: 'Thomas Mathew',
      city: 'Kochi',
      state: 'Kerala',
      gstNumber: '32AABCM2829T1Z5',
      address: '15 Infopark Expressway, Kakkanad',
      category: 'IT Services',
      services: ['Network Cabling', 'VoIP Setup', 'Wi-Fi Mesh Infrastructure'],
      status: 'Active',
      rating: 4.3,
      ratings: { quality: 4.4, delivery: 4.3, pricing: 4.2, communication: 4.3, reliability: 4.3, compliance: 4.3 },
      registrationDate: new Date('2024-08-22')
    },
    // Pending Vendors (3)
    {
      vendorId: 'VND-013',
      vendorName: 'FutureGrid Technologies',
      companyName: 'FutureGrid Technologies LLP',
      email: 'onboarding@futuregrid.test',
      phone: '+91 99004 44523',
      contactPerson: 'Siddharth Nair',
      city: 'Bengaluru',
      state: 'Karnataka',
      gstNumber: '29AABCF3031U1Z8',
      address: '9 Electronic City Phase 2',
      category: 'Software',
      services: ['Machine Learning Models', 'Data Analytics Dashboards'],
      status: 'Pending',
      rating: 4.6,
      ratings: { quality: 4.7, delivery: 4.6, pricing: 4.4, communication: 4.6, reliability: 4.6, compliance: 4.7 },
      registrationDate: new Date('2024-09-02')
    },
    {
      vendorId: 'VND-014',
      vendorName: 'SmartServe Enterprises',
      companyName: 'SmartServe Facilities India',
      email: 'review@smartserve.test',
      phone: '+91 98205 55634',
      contactPerson: 'Pooja Kulkarni',
      city: 'Mumbai',
      state: 'Maharashtra',
      gstNumber: '27AABCS3233V1Z1',
      address: '22 Bandra Kurla Complex',
      category: 'Facility Management',
      services: ['Cafeteria Management', 'Front Desk Staffing'],
      status: 'Pending',
      rating: 3.7,
      ratings: { quality: 3.8, delivery: 3.6, pricing: 3.9, communication: 3.7, reliability: 3.7, compliance: 3.5 },
      registrationDate: new Date('2024-09-10')
    },
    {
      vendorId: 'VND-015',
      vendorName: 'Horizon Business Solutions',
      companyName: 'Horizon Business Consultants',
      email: 'proposals@horizonbiz.test',
      phone: '+91 98106 66745',
      contactPerson: 'Amitav Ghosh',
      city: 'Delhi',
      state: 'Delhi NCR',
      gstNumber: '07AABCH3435W1Z4',
      address: '88 Okhla Phase 3',
      category: 'Consulting',
      services: ['Corporate Tax Advisory', 'HR Audit & Payroll'],
      status: 'Pending',
      rating: 4.2,
      ratings: { quality: 4.3, delivery: 4.1, pricing: 4.0, communication: 4.4, reliability: 4.2, compliance: 4.2 },
      registrationDate: new Date('2024-09-18')
    },
    // Suspended Vendors (2)
    {
      vendorId: 'VND-016',
      vendorName: 'OakTree Procurement Services',
      companyName: 'OakTree Procurement Services Ltd',
      email: 'notice@oaktree.test',
      phone: '+91 98307 77856',
      contactPerson: 'Subhash Sen',
      city: 'Kolkata',
      state: 'West Bengal',
      gstNumber: '19AABCO3637X1Z7',
      address: '14 Park Street, Camac Street Area',
      category: 'Logistics',
      services: ['Inter-state Hauling', 'Customs Clearing'],
      status: 'Suspended',
      rating: 3.5,
      ratings: { quality: 3.6, delivery: 3.2, pricing: 3.8, communication: 3.4, reliability: 3.4, compliance: 3.6 },
      registrationDate: new Date('2024-02-18')
    },
    {
      vendorId: 'VND-017',
      vendorName: 'DeltaPoint Systems',
      companyName: 'DeltaPoint Security Systems',
      email: 'audit@deltapoint.test',
      phone: '+91 97008 88967',
      contactPerson: 'Naveen Varma',
      city: 'Hyderabad',
      state: 'Telangana',
      gstNumber: '36AABCD3839Y1Z0',
      address: '50 Begumpet Main Road',
      category: 'Security Services',
      services: ['CCTV Surveillance', 'Biometric Access Gates', 'Security Guard Deployment'],
      status: 'Suspended',
      rating: 3.9,
      ratings: { quality: 4.0, delivery: 3.7, pricing: 3.9, communication: 3.8, reliability: 4.0, compliance: 4.0 },
      registrationDate: new Date('2024-04-02')
    },
    // Inactive Vendors (3)
    {
      vendorId: 'VND-018',
      vendorName: 'NovaLink Services',
      companyName: 'NovaLink Marketing & Media',
      email: 'archive@novalink.test',
      phone: '+91 98409 99078',
      contactPerson: 'Swathi Narayanan',
      city: 'Chennai',
      state: 'Tamil Nadu',
      gstNumber: '33AABCN4041Z1Z3',
      address: '12 Cathedral Road, Gopalapuram',
      category: 'Marketing',
      services: ['Brand Collateral Printing', 'Event Signage', 'Digital Media Kits'],
      status: 'Inactive',
      rating: 4.0,
      ratings: { quality: 4.1, delivery: 4.0, pricing: 4.0, communication: 4.0, reliability: 4.0, compliance: 3.9 },
      registrationDate: new Date('2024-01-28')
    },
    {
      vendorId: 'VND-019',
      vendorName: 'ProConnect Solutions',
      companyName: 'ProConnect Telecom & IT',
      email: 'closed@proconnect.test',
      phone: '+91 98501 00189',
      contactPerson: 'Girish Patil',
      city: 'Pune',
      state: 'Maharashtra',
      gstNumber: '27AABCP4243A1Z6',
      address: '7 Senapati Bapat Road',
      category: 'IT Services',
      services: ['Legacy PBX Maintenance', 'Ethernet Patching'],
      status: 'Inactive',
      rating: 3.7,
      ratings: { quality: 3.8, delivery: 3.5, pricing: 3.9, communication: 3.7, reliability: 3.6, compliance: 3.7 },
      registrationDate: new Date('2024-02-24')
    },
    {
      vendorId: 'VND-020',
      vendorName: 'EastGate Supplies',
      companyName: 'EastGate Stationery & Supplies',
      email: 'support@eastgate.test',
      phone: '+91 94402 11290',
      contactPerson: 'Laxmi Menon',
      city: 'Kochi',
      state: 'Kerala',
      gstNumber: '32AABCE4445B1Z9',
      address: '3 MG Road, Ernakulam',
      category: 'Office Supplies',
      services: ['General Stationery', 'Filing Folders', 'Packing Tapes'],
      status: 'Inactive',
      rating: 3.6,
      ratings: { quality: 3.7, delivery: 3.6, pricing: 3.6, communication: 3.5, reliability: 3.6, compliance: 3.6 },
      registrationDate: new Date('2024-03-12')
    }
  ];

  const createdVendors = await Vendor.insertMany(rawVendors);
  console.log(`Created ${createdVendors.length} vendors (12 Active, 3 Pending, 2 Suspended, 3 Inactive).`);

  // Map for easy vendor ID lookup
  const vendorMap = {};
  createdVendors.forEach(v => {
    vendorMap[v.vendorId] = v;
  });

  // 3. Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const vendorPassword = await bcrypt.hash('vendor123', 10);

  const demoUsers = [
    {
      name: 'Kathir Sanjay',
      email: 'admin@vendom.com',
      password: adminPassword,
      role: 'admin'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@vendom.com',
      password: adminPassword,
      role: 'admin'
    },
    {
      name: 'Arun Kumar',
      email: 'arun.kumar@vendom.com',
      password: adminPassword,
      role: 'admin'
    },
    {
      name: 'Rajesh Raman',
      email: 'vendor@northstar.test',
      password: vendorPassword,
      role: 'vendor',
      vendor: vendorMap['VND-001']._id
    },
    {
      name: 'Ananya Sharma',
      email: 'tech@bluepeak.test',
      password: vendorPassword,
      role: 'vendor',
      vendor: vendorMap['VND-002']._id
    },
    {
      name: 'Vikram Mehta',
      email: 'dispatch@vertex.test',
      password: vendorPassword,
      role: 'vendor',
      vendor: vendorMap['VND-004']._id
    }
  ];

  await User.insertMany(demoUsers);
  console.log(`Created ${demoUsers.length} system users.`);

  // 4. Create 22 Products & Services across vendors
  const rawProducts = [
    {
      productId: 'PRD-101',
      name: 'Office Stationery Package',
      description: 'Comprehensive office set including high-grade A4 sheets, ballpoint pens, notepads, and binders.',
      category: 'Office Supplies',
      price: 8500,
      quantity: 120,
      vendor: vendorMap['VND-001']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-102',
      name: 'Laptop Maintenance Service',
      description: 'Quarterly hardware diagnostics, thermal paste re-application, and internal dust cleaning.',
      category: 'IT Services',
      price: 18500,
      quantity: 45,
      vendor: vendorMap['VND-002']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-103',
      name: 'Cloud Hosting & Storage SLA',
      description: 'Dedicated Linux virtual servers with 99.9% uptime, daily automated snapshots, and SSL.',
      category: 'Cloud Services',
      price: 45000,
      quantity: 60,
      vendor: vendorMap['VND-010']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-104',
      name: 'Network Installation & Cabling',
      description: 'Cat6 structured Ethernet cabling, patch panel punch-down, and cable trunking setup.',
      category: 'IT Services',
      price: 32000,
      quantity: 25,
      vendor: vendorMap['VND-012']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-105',
      name: 'High-Yield Printer Toner Supplies',
      description: 'Pack of 4 high-yield black and CMYK toner cartridges for enterprise laser printers.',
      category: 'Office Supplies',
      price: 12800,
      quantity: 85,
      vendor: vendorMap['VND-003']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-106',
      name: 'Campus Security & Guard Service',
      description: 'Monthly 24/7 security guard rotation and visitor gate log maintenance.',
      category: 'Security Services',
      price: 65000,
      quantity: 15,
      vendor: vendorMap['VND-006']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-107',
      name: 'Custom Web & Mobile Development',
      description: 'Full-stack React and Node.js custom software engineering sprint (40 engineer hours).',
      category: 'Software',
      price: 95000,
      quantity: 30,
      vendor: vendorMap['VND-007']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-108',
      name: 'IT Strategy & Architecture Consulting',
      description: 'Infrastructure maturity audit, security posture review, and cloud migration roadmapping.',
      category: 'Consulting',
      price: 75000,
      quantity: 20,
      vendor: vendorMap['VND-008']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-109',
      name: 'Enterprise Server Maintenance',
      description: 'Rackmount server preventive check, RAID array parity validation, and firmware updates.',
      category: 'Hardware',
      price: 28400,
      quantity: 35,
      vendor: vendorMap['VND-005']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-110',
      name: 'Inter-City Freight Transport',
      description: 'GPS-tracked dedicated container transport across major South & West Indian commercial hubs.',
      category: 'Logistics',
      price: 42000,
      quantity: 50,
      vendor: vendorMap['VND-004']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-111',
      name: 'Commercial Deep Cleaning Package',
      description: 'Complete floor scrubbing, carpet shampooing, sanitization, and glass facade wash.',
      category: 'Facility Management',
      price: 22000,
      quantity: 40,
      vendor: vendorMap['VND-006']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-112',
      name: 'Facility Electrical Maintenance',
      description: 'Transformer testing, backup generator maintenance, and circuit breaker inspections.',
      category: 'Facility Management',
      price: 19500,
      quantity: 30,
      vendor: vendorMap['VND-006']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-113',
      name: 'Digital Brand & Collateral Marketing',
      description: 'Design and print of corporate brochures, event standees, and executive folders.',
      category: 'Marketing',
      price: 15500,
      quantity: 20,
      vendor: vendorMap['VND-001']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-114',
      name: 'Enterprise Hardware Supply (RAM & SSD)',
      description: 'Batch of 10x 32GB DDR4 Server ECC RAM modules and 2TB NVMe PCIe Gen4 SSDs.',
      category: 'Hardware',
      price: 84000,
      quantity: 18,
      vendor: vendorMap['VND-011']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-115',
      name: 'Managed Database Support (PostgreSQL / Mongo)',
      description: 'Index optimization, automated read-replica failover setup, and vacuum scheduling.',
      category: 'IT Services',
      price: 38000,
      quantity: 25,
      vendor: vendorMap['VND-002']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-116',
      name: 'Cybersecurity Vulnerability Audit',
      description: 'Penetration testing of web endpoints, network port scanning, and OWASP compliance audit.',
      category: 'Software',
      price: 68000,
      quantity: 15,
      vendor: vendorMap['VND-007']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-117',
      name: 'Cloud Database Migration Service',
      description: 'Zero-downtime database schema migration and replication to AWS/GCP cloud environments.',
      category: 'Cloud Services',
      price: 115000,
      quantity: 10,
      vendor: vendorMap['VND-010']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-118',
      name: 'Corporate Software Licensing Package',
      description: 'Volume licensing package for productivity suites and development IDE tools.',
      category: 'Software',
      price: 52000,
      quantity: 50,
      vendor: vendorMap['VND-007']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-119',
      name: 'Integrated Facility Management Contract',
      description: 'End-to-end building maintenance, plumbing, air conditioning, and waste disposal.',
      category: 'Facility Management',
      price: 125000,
      quantity: 8,
      vendor: vendorMap['VND-006']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-120',
      name: 'Technical Training & Certification Sprint',
      description: '3-day hands-on corporate workshop on cloud architecture and microservices security.',
      category: 'Consulting',
      price: 48000,
      quantity: 12,
      vendor: vendorMap['VND-008']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-121',
      name: 'Industrial Safety Gear & Helmets',
      description: 'Bulk carton of 50 CE-certified hard hats and high-visibility reflective safety vests.',
      category: 'Manufacturing',
      price: 16500,
      quantity: 75,
      vendor: vendorMap['VND-009']._id,
      status: 'Available'
    },
    {
      productId: 'PRD-122',
      name: 'Wi-Fi 6 Access Points & Router Racks',
      description: 'Multi-gigabit enterprise ceiling mount access points with central controller unit.',
      category: 'Hardware',
      price: 76200,
      quantity: 14,
      vendor: vendorMap['VND-005']._id,
      status: 'Available'
    }
  ];

  const createdProducts = await Product.insertMany(rawProducts);
  console.log(`Created ${createdProducts.length} products and services.`);

  // Map for easy product index lookup
  const productMap = {};
  createdProducts.forEach(p => {
    productMap[p.productId] = p;
  });

  // 5. Create 42 Orders to match Dashboard statistics:
  // Total: 42 | Pending: 8 | Approved/Processing: 17 | Delivered: 12 | Cancelled: 3 | Rejected: 2
  const orderConfigs = [
    // 8 Pending
    { id: 'PO-1001', prod: 'PRD-101', qty: 2, status: 'Pending', daysAgo: 1 },
    { id: 'PO-1002', prod: 'PRD-102', qty: 1, status: 'Pending', daysAgo: 2 },
    { id: 'PO-1003', prod: 'PRD-105', qty: 3, status: 'Pending', daysAgo: 3 },
    { id: 'PO-1004', prod: 'PRD-109', qty: 1, status: 'Pending', daysAgo: 4 },
    { id: 'PO-1005', prod: 'PRD-110', qty: 2, status: 'Pending', daysAgo: 5 },
    { id: 'PO-1006', prod: 'PRD-114', qty: 1, status: 'Pending', daysAgo: 6 },
    { id: 'PO-1007', prod: 'PRD-121', qty: 2, status: 'Pending', daysAgo: 7 },
    { id: 'PO-1008', prod: 'PRD-122', qty: 1, status: 'Pending', daysAgo: 8 },

    // 17 Approved / Processing / Shipped
    { id: 'PO-1009', prod: 'PRD-103', qty: 1, status: 'Approved', daysAgo: 10 },
    { id: 'PO-1010', prod: 'PRD-104', qty: 1, status: 'Approved', daysAgo: 12 },
    { id: 'PO-1011', prod: 'PRD-106', qty: 1, status: 'Approved', daysAgo: 14 },
    { id: 'PO-1012', prod: 'PRD-107', qty: 1, status: 'Approved', daysAgo: 15 },
    { id: 'PO-1013', prod: 'PRD-108', qty: 1, status: 'Approved', daysAgo: 18 },
    { id: 'PO-1014', prod: 'PRD-111', qty: 2, status: 'Approved', daysAgo: 20 },
    { id: 'PO-1015', prod: 'PRD-112', qty: 1, status: 'Approved', daysAgo: 22 },
    { id: 'PO-1016', prod: 'PRD-115', qty: 1, status: 'Approved', daysAgo: 25 },
    { id: 'PO-1017', prod: 'PRD-116', qty: 1, status: 'Approved', daysAgo: 28 },
    { id: 'PO-1018', prod: 'PRD-118', qty: 2, status: 'Approved', daysAgo: 30 },
    { id: 'PO-1019', prod: 'PRD-119', qty: 1, status: 'Approved', daysAgo: 33 },
    { id: 'PO-1020', prod: 'PRD-120', qty: 1, status: 'Approved', daysAgo: 35 },
    { id: 'PO-1021', prod: 'PRD-101', qty: 4, status: 'Approved', daysAgo: 38 },
    { id: 'PO-1022', prod: 'PRD-102', qty: 2, status: 'Approved', daysAgo: 40 },
    { id: 'PO-1023', prod: 'PRD-105', qty: 5, status: 'Approved', daysAgo: 42 },
    { id: 'PO-1024', prod: 'PRD-109', qty: 2, status: 'Approved', daysAgo: 45 },
    { id: 'PO-1025', prod: 'PRD-114', qty: 1, status: 'Approved', daysAgo: 48 },

    // 12 Delivered
    { id: 'PO-1026', prod: 'PRD-101', qty: 5, status: 'Delivered', daysAgo: 55 },
    { id: 'PO-1027', prod: 'PRD-102', qty: 2, status: 'Delivered', daysAgo: 60 },
    { id: 'PO-1028', prod: 'PRD-103', qty: 2, status: 'Delivered', daysAgo: 65 },
    { id: 'PO-1029', prod: 'PRD-104', qty: 2, status: 'Delivered', daysAgo: 70 },
    { id: 'PO-1030', prod: 'PRD-105', qty: 4, status: 'Delivered', daysAgo: 75 },
    { id: 'PO-1031', prod: 'PRD-107', qty: 1, status: 'Delivered', daysAgo: 80 },
    { id: 'PO-1032', prod: 'PRD-108', qty: 1, status: 'Delivered', daysAgo: 85 },
    { id: 'PO-1033', prod: 'PRD-110', qty: 3, status: 'Delivered', daysAgo: 90 },
    { id: 'PO-1034', prod: 'PRD-111', qty: 2, status: 'Delivered', daysAgo: 95 },
    { id: 'PO-1035', prod: 'PRD-115', qty: 2, status: 'Delivered', daysAgo: 100 },
    { id: 'PO-1036', prod: 'PRD-121', qty: 5, status: 'Delivered', daysAgo: 105 },
    { id: 'PO-1037', prod: 'PRD-122', qty: 1, status: 'Delivered', daysAgo: 110 },

    // 3 Cancelled
    { id: 'PO-1038', prod: 'PRD-113', qty: 3, status: 'Cancelled', daysAgo: 115 },
    { id: 'PO-1039', prod: 'PRD-117', qty: 1, status: 'Cancelled', daysAgo: 120 },
    { id: 'PO-1040', prod: 'PRD-120', qty: 2, status: 'Cancelled', daysAgo: 125 },

    // 2 Rejected
    { id: 'PO-1041', prod: 'PRD-106', qty: 1, status: 'Rejected', daysAgo: 130 },
    { id: 'PO-1042', prod: 'PRD-114', qty: 2, status: 'Rejected', daysAgo: 135 }
  ];

  const now = Date.now();
  const rawOrders = orderConfigs.map(c => {
    const p = productMap[c.prod];
    const orderDate = new Date(now - c.daysAgo * 24 * 60 * 60 * 1000);
    const expectedDelivery = new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      orderId: c.id,
      vendor: p.vendor,
      product: p._id,
      quantity: c.qty,
      unitPrice: p.price,
      totalAmount: p.price * c.qty,
      status: c.status,
      orderDate,
      expectedDelivery
    };
  });

  const createdOrders = await Order.insertMany(rawOrders);
  console.log(`Created ${createdOrders.length} orders (8 Pending, 17 Approved, 12 Delivered, 3 Cancelled, 2 Rejected).`);

  // 6. Create 18 Contracts to match Dashboard statistics:
  // Total: 18 | Active: 12 | Expiring Soon: 3 | Expired: 2 | Draft: 1
  const contractConfigs = [
    // 12 Active
    { id: 'CTR-1001', v: 'VND-001', title: 'Annual Corporate Stationery & Paper Supply SLA', val: 350000, terms: 'Net 30', status: 'Active', startMonthsAgo: 6, endMonthsAhead: 6 },
    { id: 'CTR-1002', v: 'VND-002', title: 'Managed Cloud Infrastructure & L2/L3 Support', val: 780000, terms: 'Net 45', status: 'Active', startMonthsAgo: 8, endMonthsAhead: 4 },
    { id: 'CTR-1003', v: 'VND-003', title: 'Workplace Ergonomics & Consumables Framework', val: 290000, terms: 'Net 30', status: 'Active', startMonthsAgo: 5, endMonthsAhead: 7 },
    { id: 'CTR-1004', v: 'VND-004', title: 'Southern Region Logistics & Freight Agreement', val: 620000, terms: 'Net 30', status: 'Active', startMonthsAgo: 7, endMonthsAhead: 5 },
    { id: 'CTR-1005', v: 'VND-005', title: 'Data Center Hardware & Storage Rack Maintenance', val: 540000, terms: 'Quarterly Advance', status: 'Active', startMonthsAgo: 4, endMonthsAhead: 8 },
    { id: 'CTR-1006', v: 'VND-006', title: 'Comprehensive Facilities Management & Sanitation', val: 980000, terms: 'Net 30', status: 'Active', startMonthsAgo: 9, endMonthsAhead: 3 },
    { id: 'CTR-1007', v: 'VND-007', title: 'Custom Software Retainer & API Maintenance', val: 1140000, terms: 'Milestone-based', status: 'Active', startMonthsAgo: 6, endMonthsAhead: 6 },
    { id: 'CTR-1008', v: 'VND-008', title: 'Enterprise Strategic Sourcing & Compliance Audit', val: 420000, terms: 'Net 45', status: 'Active', startMonthsAgo: 3, endMonthsAhead: 9 },
    { id: 'CTR-1009', v: 'VND-009', title: 'Plant Safety Workwear & Industrial Tool Supply', val: 310000, terms: 'Net 30', status: 'Active', startMonthsAgo: 6, endMonthsAhead: 6 },
    { id: 'CTR-1010', v: 'VND-010', title: 'Multi-Region Cloud Hosting & Disaster Recovery SLA', val: 1450000, terms: 'Net 30', status: 'Active', startMonthsAgo: 5, endMonthsAhead: 7 },
    { id: 'CTR-1011', v: 'VND-011', title: 'Hardware Spare Replacements & Warranty Guarantee', val: 490000, terms: 'Net 45', status: 'Active', startMonthsAgo: 4, endMonthsAhead: 8 },
    { id: 'CTR-1012', v: 'VND-012', title: 'VoIP Infrastructure & High-Speed Network SLA', val: 360000, terms: 'Net 30', status: 'Active', startMonthsAgo: 6, endMonthsAhead: 6 },

    // 3 Expiring Soon (ends in 30 to 60 days)
    { id: 'CTR-1013', v: 'VND-002', title: 'Specialized DevOps Automation Consulting Contract', val: 280000, terms: 'Net 30', status: 'Expiring Soon', startMonthsAgo: 11, endDaysAhead: 35 },
    { id: 'CTR-1014', v: 'VND-004', title: 'Priority Inter-State Express Logistics Route', val: 340000, terms: 'Net 30', status: 'Expiring Soon', startMonthsAgo: 11, endDaysAhead: 45 },
    { id: 'CTR-1015', v: 'VND-006', title: 'HVAC Air Purification & Filter Replacement Agreement', val: 210000, terms: 'Net 30', status: 'Expiring Soon', startMonthsAgo: 10, endDaysAhead: 52 },

    // 2 Expired
    { id: 'CTR-1016', v: 'VND-016', title: 'Kolkata Regional Warehousing & Logistics Agreement', val: 400000, terms: 'Net 30', status: 'Expired', startMonthsAgo: 18, endMonthsAgo: 2 },
    { id: 'CTR-1017', v: 'VND-017', title: 'Physical Access Control & CCTV Hardware Contract', val: 320000, terms: 'Net 45', status: 'Expired', startMonthsAgo: 16, endMonthsAgo: 3 },

    // 1 Draft
    { id: 'CTR-1018', v: 'VND-013', title: 'Enterprise AI & Machine Learning Pipeline Integration', val: 850000, terms: 'Milestone-based', status: 'Draft', startDaysAhead: 15, endMonthsAhead: 12 }
  ];

  const rawContracts = contractConfigs.map(c => {
    const v = vendorMap[c.v];
    let startDate, endDate;
    if (c.startMonthsAgo) startDate = new Date(now - c.startMonthsAgo * 30 * 24 * 60 * 60 * 1000);
    else if (c.startDaysAhead) startDate = new Date(now + c.startDaysAhead * 24 * 60 * 60 * 1000);
    else startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);

    if (c.endMonthsAhead) endDate = new Date(now + c.endMonthsAhead * 30 * 24 * 60 * 60 * 1000);
    else if (c.endDaysAhead) endDate = new Date(now + c.endDaysAhead * 24 * 60 * 60 * 1000);
    else if (c.endMonthsAgo) endDate = new Date(now - c.endMonthsAgo * 30 * 24 * 60 * 60 * 1000);
    else endDate = new Date(now + 180 * 24 * 60 * 60 * 1000);

    return {
      contractId: c.id,
      vendor: v._id,
      contractTitle: c.title,
      contractValue: c.val,
      paymentTerms: c.terms,
      status: c.status,
      startDate,
      endDate
    };
  });

  const createdContracts = await Contract.insertMany(rawContracts);
  console.log(`Created ${createdContracts.length} contracts (12 Active, 3 Expiring Soon, 2 Expired, 1 Draft).`);

  // 7. Create 35 Invoices to match Dashboard statistics:
  // Total: 35 | Paid: 21 | Pending: 7 | Overdue: 4 | Rejected: 3
  const invoiceConfigs = [
    // 21 Paid
    { id: 'INV-2001', v: 'VND-001', po: 'PO-1026', amt: 42500, status: 'Paid', dueDaysAgo: 50 },
    { id: 'INV-2002', v: 'VND-002', po: 'PO-1027', amt: 37000, status: 'Paid', dueDaysAgo: 45 },
    { id: 'INV-2003', v: 'VND-003', po: 'PO-1030', amt: 51200, status: 'Paid', dueDaysAgo: 40 },
    { id: 'INV-2004', v: 'VND-004', po: 'PO-1033', amt: 126000, status: 'Paid', dueDaysAgo: 38 },
    { id: 'INV-2005', v: 'VND-005', po: 'PO-1004', amt: 28400, status: 'Paid', dueDaysAgo: 35 },
    { id: 'INV-2006', v: 'VND-006', po: 'PO-1034', amt: 44000, status: 'Paid', dueDaysAgo: 32 },
    { id: 'INV-2007', v: 'VND-007', po: 'PO-1031', amt: 95000, status: 'Paid', dueDaysAgo: 30 },
    { id: 'INV-2008', v: 'VND-008', po: 'PO-1032', amt: 75000, status: 'Paid', dueDaysAgo: 28 },
    { id: 'INV-2009', v: 'VND-009', po: 'PO-1036', amt: 82500, status: 'Paid', dueDaysAgo: 25 },
    { id: 'INV-2010', v: 'VND-010', po: 'PO-1028', amt: 90000, status: 'Paid', dueDaysAgo: 22 },
    { id: 'INV-2011', v: 'VND-011', po: 'PO-1037', amt: 76200, status: 'Paid', dueDaysAgo: 20 },
    { id: 'INV-2012', v: 'VND-012', po: 'PO-1029', amt: 64000, status: 'Paid', dueDaysAgo: 18 },
    { id: 'INV-2013', v: 'VND-001', po: 'PO-1021', amt: 34000, status: 'Paid', dueDaysAgo: 16 },
    { id: 'INV-2014', v: 'VND-002', po: 'PO-1022', amt: 37000, status: 'Paid', dueDaysAgo: 14 },
    { id: 'INV-2015', v: 'VND-003', po: 'PO-1023', amt: 64000, status: 'Paid', dueDaysAgo: 12 },
    { id: 'INV-2016', v: 'VND-005', po: 'PO-1024', amt: 56800, status: 'Paid', dueDaysAgo: 10 },
    { id: 'INV-2017', v: 'VND-007', po: 'PO-1012', amt: 95000, status: 'Paid', dueDaysAgo: 8 },
    { id: 'INV-2018', v: 'VND-008', po: 'PO-1013', amt: 75000, status: 'Paid', dueDaysAgo: 6 },
    { id: 'INV-2019', v: 'VND-010', po: 'PO-1009', amt: 45000, status: 'Paid', dueDaysAgo: 5 },
    { id: 'INV-2020', v: 'VND-011', po: 'PO-1025', amt: 84000, status: 'Paid', dueDaysAgo: 4 },
    { id: 'INV-2021', v: 'VND-012', po: 'PO-1010', amt: 32000, status: 'Paid', dueDaysAgo: 2 },

    // 7 Pending
    { id: 'INV-2022', v: 'VND-001', po: 'PO-1001', amt: 17000, status: 'Pending', dueDaysAhead: 15 },
    { id: 'INV-2023', v: 'VND-002', po: 'PO-1002', amt: 18500, status: 'Pending', dueDaysAhead: 18 },
    { id: 'INV-2024', v: 'VND-003', po: 'PO-1003', amt: 38400, status: 'Pending', dueDaysAhead: 20 },
    { id: 'INV-2025', v: 'VND-004', po: 'PO-1005', amt: 84000, status: 'Pending', dueDaysAhead: 22 },
    { id: 'INV-2026', v: 'VND-005', po: 'PO-1008', amt: 76200, status: 'Pending', dueDaysAhead: 25 },
    { id: 'INV-2027', v: 'VND-006', po: 'PO-1014', amt: 44000, status: 'Pending', dueDaysAhead: 28 },
    { id: 'INV-2028', v: 'VND-009', po: 'PO-1007', amt: 33000, status: 'Pending', dueDaysAhead: 30 },

    // 4 Overdue (Due in the past, status is Overdue)
    { id: 'INV-2029', v: 'VND-016', po: 'PO-1038', amt: 46500, status: 'Overdue', dueDaysAgo: 22 },
    { id: 'INV-2030', v: 'VND-017', po: 'PO-1041', amt: 65000, status: 'Overdue', dueDaysAgo: 15 },
    { id: 'INV-2031', v: 'VND-004', po: 'PO-1014', amt: 38000, status: 'Overdue', dueDaysAgo: 12 },
    { id: 'INV-2032', v: 'VND-006', po: 'PO-1015', amt: 19500, status: 'Overdue', dueDaysAgo: 9 },

    // 3 Rejected
    { id: 'INV-2033', v: 'VND-011', po: 'PO-1042', amt: 168000, status: 'Rejected', dueDaysAgo: 14 },
    { id: 'INV-2034', v: 'VND-010', po: 'PO-1039', amt: 115000, status: 'Rejected', dueDaysAgo: 18 },
    { id: 'INV-2035', v: 'VND-008', po: 'PO-1040', amt: 96000, status: 'Rejected', dueDaysAgo: 25 }
  ];

  const rawInvoices = invoiceConfigs.map(c => {
    const v = vendorMap[c.v];
    const tax = Math.round(c.amt * 0.18);
    const total = c.amt + tax;
    let invoiceDate, dueDate, paidDate;

    if (c.dueDaysAhead) {
      invoiceDate = new Date(now - 5 * 24 * 60 * 60 * 1000);
      dueDate = new Date(now + c.dueDaysAhead * 24 * 60 * 60 * 1000);
    } else {
      dueDate = new Date(now - c.dueDaysAgo * 24 * 60 * 60 * 1000);
      invoiceDate = new Date(dueDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (c.status === 'Paid') {
        paidDate = new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000);
      }
    }

    return {
      invoiceNumber: c.id,
      vendor: v._id,
      orderId: c.po,
      invoiceDate,
      dueDate,
      amount: c.amt,
      tax,
      total,
      paymentStatus: c.status,
      paidDate
    };
  });

  const createdInvoices = await Invoice.insertMany(rawInvoices);
  console.log(`Created ${createdInvoices.length} invoices (21 Paid, 7 Pending, 4 Overdue, 3 Rejected).`);

  // 8. Create 8 Realistic Activities for the dashboard activity feed
  const rawActivities = [
    {
      title: 'New vendor added',
      description: 'BluePeak Technologies was added to IT Services partner network.',
      type: 'vendor',
      timestamp: new Date(now - 2 * 60 * 60 * 1000)
    },
    {
      title: 'Purchase order approved',
      description: 'Purchase order PO-1024 (₹56,800) for Server Maintenance was approved.',
      type: 'order',
      timestamp: new Date(now - 5 * 60 * 60 * 1000)
    },
    {
      title: 'Invoice marked as paid',
      description: 'Invoice INV-2041 (₹75,000) to BrightSource Advisory Group was marked as paid.',
      type: 'invoice',
      timestamp: new Date(now - 14 * 60 * 60 * 1000)
    },
    {
      title: 'Contract expiring soon',
      description: 'Contract CTR-1012 with MetroWorks Solutions is expiring in 35 days.',
      type: 'contract',
      timestamp: new Date(now - 22 * 60 * 60 * 1000)
    },
    {
      title: 'Vendor rating updated',
      description: 'Vendor NexaTech Solutions received a 4.6 overall performance rating.',
      type: 'rating',
      timestamp: new Date(now - 36 * 60 * 60 * 1000)
    },
    {
      title: 'New vendor registration pending',
      description: 'FutureGrid Technologies registration is awaiting administrative review.',
      type: 'vendor',
      timestamp: new Date(now - 48 * 60 * 60 * 1000)
    },
    {
      title: 'Stock replenished',
      description: 'Industrial Safety Gear & Workwear inventory updated to 75 units.',
      type: 'order',
      timestamp: new Date(now - 72 * 60 * 60 * 1000)
    },
    {
      title: 'Contract renewal initiated',
      description: 'Renewal draft requested for UrbanEdge Facilities HVAC SLA.',
      type: 'contract',
      timestamp: new Date(now - 96 * 60 * 60 * 1000)
    }
  ];

  await Activity.insertMany(rawActivities);
  console.log(`Created ${rawActivities.length} recent activity items.`);

  console.log('--- Vendor Management System Demo Seeding Complete ---');
  return {
    vendors: createdVendors.length,
    products: createdProducts.length,
    orders: createdOrders.length,
    contracts: createdContracts.length,
    invoices: createdInvoices.length,
    users: demoUsers.length
  };
}

// Standalone execution support
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const configuredUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vendor-management';
  let memoryServer = null;
  try {
    await mongoose.connect(configuredUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`Connected to MongoDB at ${configuredUri}`);
  } catch {
    console.log('Local MongoDB unavailable; using in-memory MongoDB instance for standalone test...');
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
  }

  try {
    await seedAllData();
  } finally {
    await mongoose.disconnect();
    if (memoryServer) await memoryServer.stop();
    process.exit(0);
  }
}
