# PRAVI Asset Control 🏗️

> **Infrastructure Operations & Asset Lifecycle Management Platform**  
> Monitor infrastructure assets, field inspections, reported defects, and maintenance work orders from a unified operational control room.

---

## 🌟 Overview

**PRAVI Asset Control** is a full-stack infrastructure management platform designed for public works, transportation authorities, and enterprise facility operations. It provides real-time visibility into asset health, geographical positioning, lifecycle state transitions, field inspection history, and maintenance workflows.

Built specifically for high-efficiency operation, PRAVI features a **Header-Based Demo RBAC Architecture** (`X-Role`) allowing instant role switching between Administrator, Inspector, Maintenance Operator, and Viewer personas without login friction.

---

## ✨ Core Features

### 🏢 1. Asset Register & Lifecycle Management
- **Centralized Register**: Filter and search assets by asset code, name, type (`ROAD`, `BRIDGE`, `BUILDING`), or operational status (`PLANNED`, `UNDER_CONSTRUCTION`, `OPERATIONAL`, `MAINTENANCE`, `RETIRED`).
- **Asset Detail View**: Deep dive into asset condition scores, expected EOL dates, criticality ratings (1–5), location coordinates, and lifecycle audit history.
- **Strict State Machine**: Controlled transitions (`PLANNED` → `UNDER_CONSTRUCTION` → `OPERATIONAL` ↔ `MAINTENANCE`). The `RETIRED` state is protected and reserved exclusively for Administrators.

### 📋 2. Field Inspections & Condition Audits
- **Condition Scoring**: Record 0–100 condition checks with inspection notes.
- **Automatic Score Cascade**: Submitting an inspection automatically recalculates and updates the target asset's overall condition score.
- **Historical Audit Log**: View chronological inspection records with timestamped scores.

### ⚠️ 3. Defect & Incident Tracking
- **Categorized Defect Logging**: Report defects by type (`SURFACE`, `STRUCTURAL`, `DRAINAGE`, `SIGNAGE`, `ELECTRICAL`, `OTHER`) and severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **Defect Workflow**: Progress issues through `OPEN` → `IN_PROGRESS` → `RESOLVED`.

### 🛠️ 4. Maintenance Board & Work Orders
- **Interactive Work Card Board**: Filter active work orders by status (`OPEN`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`).
- **Work Order Creation**: Create work orders with scheduled dates, priority levels, estimated costs, and assigned personnel.
- **Granular Status Advancement**: Role-restricted status transitions ensuring proper verification before closing work orders.

### 🗺️ 5. GIS Geospatial Mapping
- **Interactive Map**: Built with Leaflet to plot infrastructure assets on live interactive maps using exact latitude and longitude coordinates.
- **Visual Status Markers**: Quick popups displaying asset codes, types, and current condition scores directly from map pins.

### 📊 6. Control Room Dashboard & Executive Analytics
- **Live Operations Dashboard**: KPI summary cards for total registered assets, average portfolio condition score, open defect counts, and active maintenance jobs.
- **Risk Watch List**: Instant visibility into lowest-condition assets requiring immediate intervention.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

PRAVI enforces role-based visibility in the UI and backend validation for all API actions:

| Action / Feature | Admin | Inspector | Maintenance | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| **View Dashboard, Map, & Details** | ✅ | ✅ | ✅ | ✅ |
| **Register & Edit Assets** | ✅ | ✅ | ❌ | ❌ |
| **Retire Assets** | ✅ | ❌ | ❌ | ❌ |
| **Change Asset Lifecycle** | ✅ | ✅ | ❌ | ❌ |
| **Perform Inspection & Score** | ✅ | ✅ | ❌ | ❌ |
| **Report & Edit Defects** | ✅ | ✅ | ✅ | ❌ |
| **Create Work Order** | ✅ | ✅ | ✅ | ❌ |
| **Assign Work Order & Record Cost** | ✅ | ❌ | ✅ | ❌ |
| **Update Work Order Status** | ✅ | ❌ | ✅ | ❌ |
| **Close / Verify Work Order** | ✅ | ✅ | ✅ | ❌ |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Styling**: Custom CSS Design System with dark mode tokens (`tokens.css`, `App.css`)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express v5](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (`pg` driver)
- **Middleware**: Custom header-based RBAC middleware (`X-Role`)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: Local or hosted database instance

---

### 📥 1. Repository Setup

Clone the repository and install dependencies for both `server` and `client`:

```bash
# Clone repository
git clone https://github.com/devansh436/pravi-asset-tracker.git
cd pravi-asset-tracker

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### ⚙️ 2. Environment Configuration

#### Server Setup (`server/.env`)
Create a `.env` file inside the `server/` directory:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/pravi_asset_tracker
```

#### Client Setup (`client/.env`)
Create a `.env` file inside the `client/` directory (optional if running locally on port 3000):

```env
VITE_API_URL=http://localhost:3000/api
```

---

### 🗄️ 3. Database Migration & Seeding

Run the database schema migrations and populate initial seeded users and infrastructure data:

```bash
cd server

# Apply SQL schema migrations
npm run migrate

# Seed initial roles and demo infrastructure assets
npm run seed
```

---

### 🏃 4. Running the Application

#### Start Backend Server
```bash
cd server
npm run dev
# Server running at http://localhost:3000
```

#### Start Frontend Client (in a separate terminal)
```bash
cd client
npm run dev
# Frontend running at http://localhost:5173
```

Open `http://localhost:5173` in your browser to launch the **Role Picker** and enter the control room!

---

## 🧪 Verification & Testing

The project includes an end-to-end smoke verification script testing all 4 roles against backend RBAC rules:

```bash
cd server
npm run smoke:e2e
```

To run a production build check for the frontend client:

```bash
cd client
npm run build
```

---

## 📁 Project Structure

```text
pravi-asset-tracker/
├── client/                     # React 19 Frontend Application
│   ├── src/
│   │   ├── api/                # API client & resource endpoints
│   │   ├── components/         # Reusable UI components (Assets, Maintenance, Map, Layout)
│   │   ├── config/             # Role definitions & permissions matrix
│   │   ├── context/            # RoleContext & state management
│   │   ├── hooks/              # Custom hooks (usePermissions, useResource)
│   │   ├── pages/              # RolePicker, Overview, Assets, Detail, Inspections, Maintenance, Map, Alerts
│   │   └── App.jsx             # React router configuration
│   ├── package.json
│   └── vite.config.js
│
└── server/                     # Express 5 Backend API Server
    ├── scripts/                # E2E smoke testing script
    ├── src/
    │   ├── config/             # DB pool & environment loaders
    │   ├── controllers/        # Asset, Inspection, Defect, Maintenance controllers
    │   ├── db/                 # SQL migrations & seed scripts
    │   ├── middleware/         # Role RBAC (X-Role header) & error handlers
    │   ├── routes/             # Express API routes
    │   └── services/           # Core business logic & database transactions
    ├── package.json
    └── README.md
```

---

## 📄 License

This project is open-source and available under the **MIT License**.
# pravi-asset-tracker