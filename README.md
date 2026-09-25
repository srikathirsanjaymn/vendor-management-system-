# Vendom Vendor Management System

Vendom is a small full-stack Vendor Management System created for a college Full Stack Development project. It gives an organization one place to manage vendors, products or services, and orders.

This README is written for someone who has never run this project before. Follow the sections in order.

## 1. What The Application Does

The application has two types of users:

- **Admin:** manages all vendors, products, and orders.
- **Vendor:** manages their own products and services, views their own orders, and updates the relevant order status.

The main screens are:

- **Login:** authenticates an admin or vendor.
- **Dashboard:** displays vendor, product, and order totals.
- **Vendors:** lets an admin add, edit, search, filter, activate, deactivate, and delete vendors. Selecting a vendor opens a profile with its products and orders.
- **Products & services:** lets users add, edit, search, and delete catalogue items. Products are connected to vendors using MongoDB references.
- **Orders:** lets an admin create and manage orders. Vendors can view their own orders and update their status.

Inactive vendors cannot receive new orders.

## 2. Technologies Used

### Frontend

- React: builds the browser interface.
- Vite: runs the frontend development server and creates production builds.
- Lucide React: provides interface icons.
- CSS: provides the responsive layout and visual styling.

### Backend

- Node.js: runs JavaScript outside the browser.
- Express: creates the REST API and HTTP routes.
- Mongoose: connects the backend to MongoDB and defines database models.
- JSON Web Tokens (JWT): protects authenticated API requests.
- bcryptjs: hashes passwords instead of storing plain-text passwords.

### Database

- MongoDB stores application data.
- The main collections are `users`, `vendors`, `products`, and `orders`.
- Products reference a vendor, and orders reference both a vendor and a product using MongoDB ObjectIds.

## 3. Requirements

Install these tools before starting:

1. **Node.js:** install the current LTS version from the official Node.js website. Verify it with:

	```powershell
	node --version
	npm --version
	```

2. **MongoDB Community Server:** install it from the official MongoDB website. During installation, install MongoDB as a Windows service. MongoDB must be running before the backend can connect.

3. **VS Code:** recommended for opening and running the project.

Do not install packages or tools from unknown websites. Review `package.json` files before installing dependencies.

## 4. Project Layout

```text
Vendom Management System/
|-- backend/
|   |-- config/              Configuration directory reserved for database setup
|   |-- middleware/          Authentication and role checks
|   |-- models/              Mongoose database models
|   |-- routes/              REST API route handlers
|   |-- .env.example         Backend environment variable template
|   |-- package.json         Backend dependencies and scripts
|   |-- server.js            Express server entry point
|-- frontend/
|   |-- src/
|       |-- components/      Reusable React components
|       |-- services/        Frontend API helper
|       |-- App.jsx          Main application screens and behavior
|       |-- main.jsx         React entry point
|       |-- styles.css       Application styling
|   |-- package.json         Frontend dependencies and scripts
|   |-- vite.config.js       Vite configuration
|-- package.json             Root scripts for running both applications
|-- README.md                This guide
|-- .gitignore               Files that should not be committed
```

## 5. Configure MongoDB

The application expects a local MongoDB database at:

```text
mongodb://127.0.0.1:27017/vendor-management
```

The database does not need to be created manually. MongoDB creates the database when the application first writes data.

On Windows, check and start the MongoDB service in PowerShell:

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

The service should show `Running`. If PowerShell says the service does not exist, MongoDB Community Server is either not installed or was installed without the Windows service option.

## 6. Configure Backend Environment Variables

From the project root, copy the example environment file:

```powershell
Copy-Item backend\.env.example backend\.env
```

Open `backend/.env` and set values similar to these:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/vendor-management
JWT_SECRET=use-a-long-private-random-string-here
CLIENT_URL=http://localhost:5173
```

What each setting means:

- `PORT`: port used by the Express API.
- `MONGO_URI`: address of the MongoDB database.
- `JWT_SECRET`: private value used to sign login tokens. Do not share it or commit it to Git.
- `CLIENT_URL`: address allowed to communicate with the API from the browser.

The `.env` file is ignored by Git. The example file is safe to share; the real `.env` file is private.

## 7. Install Dependencies Safely

The project has three dependency manifests: one in the root, one in `backend`, and one in `frontend`.

Install the already-declared packages with lifecycle scripts disabled:

```powershell
npm install --ignore-scripts --no-audit --no-fund
npm install --prefix backend --ignore-scripts --no-audit --no-fund
npm install --prefix frontend --ignore-scripts --no-audit --no-fund
```

The `--ignore-scripts` option prevents package lifecycle scripts from running during installation. The `--no-audit` and `--no-fund` options avoid additional npm audit and funding requests during setup.

Do not run an unfamiliar install command or add a package unless you have reviewed its name and purpose.

## 8. Start The Application

Make sure MongoDB is running, then open PowerShell in the project root:

```powershell
npm run dev
```

This starts both servers:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

Open `http://localhost:5173` in a browser. Keep the terminal open while using the application. Press `Ctrl+C` in the terminal to stop the development servers.

If you prefer to run each server separately, open two PowerShell windows:

```powershell
npm run dev --prefix backend
```

```powershell
npm run dev --prefix frontend
```

## 9. Demo Login Accounts

When the backend connects to an empty database for the first time, it creates demonstration records:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@vendom.com` | `admin123` |
| Vendor | `vendor@northstar.test` | `vendor123` |

Use the admin account to demonstrate the complete system. Use the vendor account to demonstrate vendor-specific permissions.

These credentials are only for local classroom demonstration. Do not use them in a public or shared deployment.

## 10. Suggested Demonstration Flow

1. Log in as the admin.
2. Open the dashboard and review the summary cards.
3. Open **Vendors** and add a vendor.
4. Use the search box and status filter to find vendors.
5. Select a vendor name to view its profile.
6. Open **Products & services** and add a product for an active vendor.
7. Search for the product and edit its quantity or price.
8. Open **Orders** and create or review an order through the API-backed workflow.
9. Change an order from `Pending` to `Approved`, `In Progress`, and finally `Completed`.
10. Deactivate a vendor and verify that new orders for that vendor are rejected.
11. Log out and sign in with the vendor account.
12. Confirm that the vendor can see only its own products and orders.

## 11. API Overview

All API routes are prefixed with `http://localhost:5000/api`. Protected routes require a JWT token in the request header.

### Authentication

```text
POST /api/auth/login
GET  /api/auth/me
```

### Dashboard

```text
GET /api/dashboard
```

Returns total vendors, active vendors, products, orders, and pending orders.

### Vendors

```text
GET    /api/vendors
GET    /api/vendors/:id
POST   /api/vendors
PUT    /api/vendors/:id
PATCH  /api/vendors/:id/status
DELETE /api/vendors/:id
```

### Products and services

```text
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```text
GET   /api/orders
GET   /api/orders/:id
POST  /api/orders
PATCH /api/orders/:id/status
```

The browser communicates with these REST endpoints through `frontend/src/services/api.js`. Operational data is stored in MongoDB rather than hardcoded in the frontend.

## 12. Order Statuses

Orders use these statuses:

- `Pending`: the order has been submitted and needs review.
- `Approved`: the order has been accepted.
- `In Progress`: the vendor is working on the order.
- `Completed`: the order has been fulfilled.
- `Cancelled`: the order will not be fulfilled.

When an admin creates an order, the backend checks that the vendor is active and that enough product quantity is available.

## 13. Production Build

To create a production build of the frontend:

```powershell
npm run build --prefix frontend
```

The compiled files are written to `frontend/dist`. The development server is still the simplest way to demonstrate the project locally.

## 14. Common Problems

### `MongoDB connection failed`

MongoDB is not running, the connection string is incorrect, or the MongoDB service is not installed. Start the service and check `backend/.env`.

### `EADDRINUSE: address already in use`

Another program is already using port `5000` or `5173`. Stop the other development server, or change the matching port configuration.

### The browser shows a network error

Check that both the backend and frontend terminals are running. The API should be available at `http://localhost:5000/api/health`, which should return a small JSON response with `status: "ok"`.

### Login does not work

Confirm that MongoDB was running when the backend started. Check the backend terminal for errors and use the exact demo credentials from this README.

### No records appear

The frontend reads from MongoDB through the backend. Confirm that the backend is connected and that you are using the correct role. A new database starts mostly empty apart from the demonstration records.

## 15. Security Notes

- Passwords are hashed with bcryptjs before storage.
- Protected endpoints require JWT authentication.
- Admin and vendor permissions are checked by backend middleware.
- Vendor users are restricted to their own products, profile, and orders.
- `.env` and `node_modules` are excluded from version control.
- The demonstration credentials and JWT secret must be changed before any shared or public deployment.
