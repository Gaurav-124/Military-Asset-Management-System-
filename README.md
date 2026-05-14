# 🪖 MAMS — Military Asset Management System

A full-stack MERN application for managing military assets (vehicles, weapons, ammunition, equipment) across multiple bases with Role-Based Access Control (RBAC).

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Tailwind CSS, Recharts  |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose ODM             |
| Auth       | JWT (JSON Web Tokens)              |
| Logging    | Morgan (HTTP) + Custom AuditLog   |

---

## 📁 Project Structure

```
military-asset-management/
├── backend/
│   ├── index.js              # Express server entry
│   ├── .env                  # Environment variables
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Base.js
│   │   ├── Asset.js
│   │   ├── Purchase.js
│   │   ├── Transfer.js
│   │   ├── Assignment.js
│   │   └── AuditLog.js
│   ├── routes/               # API route handlers
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── purchases.js
│   │   ├── transfers.js
│   │   ├── assignments.js
│   │   └── assets.js
│   ├── middleware/
│   │   ├── auth.js           # JWT protect + RBAC authorize
│   │   └── auditLog.js       # Transaction logger
│   └── config/
│       └── seed.js           # Database seeder
└── frontend/
    ├── src/
    │   ├── context/AuthContext.jsx
    │   ├── utils/api.js
    │   ├── components/Layout.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Dashboard.jsx
    │       ├── Purchases.jsx
    │       ├── Transfers.jsx
    │       ├── Assignments.jsx
    │       └── AuditLogs.jsx
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongodb://localhost:27017`) or MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
# Edit .env and set your MONGO_URI if needed
npm run seed       # Populate demo data
npm run dev        # Start backend on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start          # Start React app on port 3000
```

### 3. Open in browser
```
http://localhost:3000
```

---

## 🔑 Demo Login Credentials

| Role              | Email                              | Password       |
|-------------------|------------------------------------|----------------|
| Admin             | admin@military.gov                 | Admin@123      |
| Alpha Commander   | alpha.commander@military.gov       | Alpha@123      |
| Bravo Commander   | bravo.commander@military.gov       | Bravo@123      |
| Charlie Commander | charlie.commander@military.gov     | Charlie@123    |
| Logistics Officer | logistics@military.gov             | Logistics@123  |

---

## 🔐 RBAC — Role-Based Access Control

| Feature              | Admin | Base Commander | Logistics Officer |
|----------------------|:-----:|:--------------:|:-----------------:|
| Dashboard            | ✅ All | ✅ Own Base     | ✅ All             |
| Purchases (View)     | ✅    | ❌             | ✅                 |
| Purchases (Create)   | ✅    | ❌             | ✅                 |
| Transfers (View)     | ✅    | ✅             | ✅                 |
| Transfers (Create)   | ✅    | ❌             | ✅                 |
| Assignments (View)   | ✅    | ✅             | ❌                 |
| Assignments (Create) | ✅    | ✅             | ❌                 |
| Audit Logs           | ✅    | ❌             | ❌                 |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint         | Access  |
|--------|-----------------|---------|
| POST   | /api/auth/login  | Public  |
| GET    | /api/auth/me     | All     |
| GET    | /api/auth/users  | Admin   |

### Dashboard
| Method | Endpoint         | Query Params                            |
|--------|-----------------|------------------------------------------|
| GET    | /api/dashboard   | startDate, endDate, baseId, equipmentType |

### Purchases
| Method | Endpoint            | Access                   |
|--------|---------------------|--------------------------|
| GET    | /api/purchases       | All (filtered by role)   |
| POST   | /api/purchases       | Admin, Logistics         |
| DELETE | /api/purchases/:id   | Admin                    |

### Transfers
| Method | Endpoint         | Access           |
|--------|-----------------|------------------|
| GET    | /api/transfers   | All              |
| POST   | /api/transfers   | Admin, Logistics |

### Assignments
| Method | Endpoint                    | Access          |
|--------|-----------------------------|-----------------|
| GET    | /api/assignments             | Admin, Commander|
| POST   | /api/assignments             | Admin, Commander|
| PATCH  | /api/assignments/:id/expend  | Admin, Commander|
| PATCH  | /api/assignments/:id/return  | Admin, Commander|

### Other
| Method | Endpoint        | Access |
|--------|----------------|--------|
| GET    | /api/bases      | All    |
| GET    | /api/assets     | All    |
| GET    | /api/audit-logs | Admin  |

---

## 🗄 Database — MongoDB

MongoDB was chosen for:
- **Flexible schema** — assets have varying attributes by type
- **Embedded documents** — details can be nested naturally
- **Scalability** — handles large volumes of transaction logs
- **Mongoose ODM** — clean model definitions with validation

### Collections
- `users` — authentication and role data
- `bases` — Alpha, Bravo, Charlie
- `assets` — inventory per base
- `purchases` — asset acquisition records
- `transfers` — inter-base movements
- `assignments` — personnel asset assignments
- `auditlogs` — all transaction events

---

## 📊 Core Formula

```
Net Movement = Purchases + Transfers In - Transfers Out
Closing Balance = Opening Balance + Net Movement
```
