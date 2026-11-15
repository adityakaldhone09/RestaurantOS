# RestaurantOS 🍽️⚡
> **Next-Generation Hospitality Operations, POS Terminal, Kitchen Display System & Floor Management Suite**

[![React 19](https://img.shields.io/badge/React-19.3.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.5-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Shadcn / Base UI](https://img.shields.io/badge/UI_Primitives-Base_UI_%2B_Shadcn-black?style=flat-square)](https://base-ui.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)

---

## 🌟 Overview

**RestaurantOS** is an enterprise-grade hospitality operating system engineered for modern dining establishments, cloud kitchens, and multi-station restaurants. It unites front-of-house table floor management, high-velocity split POS ordering, kitchen fulfillment queues (KDS), menu 86ing, raw inventory tracking, and staff management into a single, cohesive web application.

Designed with a bespoke **Deep Eggplant Violet** (`#400849`) and **Warm Ivory** (`#FFF9F5`) visual identity accented by **Signal Orange** (`#FF5A0A`), RestaurantOS delivers a frictionless user experience with dual light/dark themes and sub-millisecond local latency.

---

## 🚀 Key Feature Modules

### 1. 📊 Operations Executive Deck (`/dashboard`)
* **Real-Time KPI Telemetry:** Live tracking of Gross Daily Revenue, Completed vs. Active Orders, Kitchen Ticket Queues, and Floor Table Occupancy percentage.
* **Hourly Sales Velocity Chart:** Interactive Recharts area visualization tracking lunch and dinner peak sales rushes.
* **Category Performance Donut:** Visual breakdown of revenue share across Appetizers, Mains, Desserts, and Beverages.
* **Live Action Alerts:** Immediate notifications for critical low-stock thresholds and orders needing kitchen attention.

### 2. 🪑 Dining Floor Seating & Tables (`/tables`)
* **Interactive Section Navigation:** Filter tables instantly by dining area (*Main Floor*, *Patio*, *Window View*, *Bar*).
* **Live Seating Statuses:** Color-coded availability indicators (*Available*, *Occupied*, *Reserved*).
* **1-Tap Seating Actions:** Seamless transition between reserving seats, starting new guest tickets, and releasing tables.
* **Dynamic Table Management:** Modal to add new tables with custom numbering, capacity, and section tags wired directly to the backend.

### 3. 💳 High-Velocity POS Terminal (`/orders/new`)
* **Split-Screen Terminal:** Left-side culinary catalog with live search, category segmented pills, preparation times, and vegetarian filters.
* **Active Dining Ticket Cart:** Real-time item additions with item notes (e.g., *"Extra crispy crust"*, *"Less ice"*).
* **Automated Calculations:** Instant computation of food & beverage subtotals, state/local tax (configurable), and total due.
* **Direct Kitchen Dispatch:** Submits the order to the backend, updates table occupancy, and routes items to the kitchen display.

### 4. 👨‍🍳 Kitchen Display System — KDS (`/kitchen`)
* **Zero-Glare Night Station Board:** Specially tuned dark canvas to eliminate glare in harsh kitchen lighting.
* **Order Elapsed Timers:** Real-time ticking timers highlighting on-range vs. overdue orders.
* **Fulfillment Pipeline:** 1-tap ticket stage progression (`Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Completed`).
* **Preparation Notes:** Distinct high-visibility alerts highlighting special customer preparation requests.

### 5. 📑 Orders Ledger & Guest Billing (`/orders` & `/orders/:id`)
* **Audited Order Ledger:** Filter orders by lifecycle status (*Confirmed*, *Preparing*, *Ready*, *Completed*, *Cancelled*).
* **Fulfillment Stepper:** Interactive visual timeline tracking order completion from placement to payment.
* **Multi-Method Bill Settlement:** Record checkout settlements via Cash, Credit/Debit Card, or Instant UPI.
* **Print-Ready Invoices:** Dedicated `@media print` thermal invoice formatting for physical guest receipts.

### 6. 🍲 Culinary Menu & 86ing Catalog (`/menu`)
* **Live Recipe Catalog:** Manage dish titles, pricing, preparation standards, and dietary classifications (*Vegetarian*, *Non-Veg*).
* **Instant 86ing:** 1-click availability toggles that immediately propagate to the POS terminal to prevent ordering sold-out dishes.
* **Add & Edit Dishes:** Complete modal interface with validation for adding and updating menu offerings.

### 7. 📦 Stock & Raw Ingredient Inventory (`/inventory`)
* **Safety Threshold Triggers:** Prominent alert banners identifying raw supplies dipping below minimum buffer levels.
* **Visual Stock Health:** Proportional progress bars displaying current stock vs. safety minimums.
* **Quick Restock:** One-click `+10` replenishment buttons and full modal for creating new raw stock items.

### 8. 👥 Staff & Team Directory (`/staff`)
* **Role-Based Directory:** Access rosters filtered by organizational role (*Admin*, *Manager*, *Waiter*, *Chef*, *Cashier*).
* **Onboarding Modal:** Create new staff credentials with assigned role permissions and telephone contact info.

### 9. ⚙️ Restaurant Configuration & Theming (`/settings`)
* **Brand Identity:** Update restaurant trading name, tagline, address, and receipt contact numbers.
* **Taxation Rules:** Configure local tax percentages and automated billing parameters.
* **Theme Engine:** Switch seamlessly between **Warm Ivory Light Mode** and **Deep Eggplant Dark Mode**.

---

## 🎨 Brand Design System

RestaurantOS uses a strictly enforced, accessible color hierarchy:

| Token | HEX | Description & Primary Usage |
|---|---|---|
| **Primary** | `#400849` | Deep Eggplant Violet — Brand identity, sidebar shell, active tabs |
| **Secondary** | `#E7B0DE` | Soft Orchid Pink — Subtle highlights, focus rings, tag pills |
| **Accent** | `#FF5A0A` | Signal Orange — Primary calls-to-action, *"Create New Order"*, high-priority alerts |
| **Background** | `#FFF9F5` | Warm Ivory — High-comfort main application canvas (Light mode) |
| **Surface** | `#FFFFFF` | Pure White — Card surfaces, metric panels, modals, dropdowns |
| **Soft Surface** | `#F9EAF5` | Soft Orchid Tint — Secondary cards, table headers, hover states |
| **Border** | `#EADFE8` | Soft Pink Border — Crisp dividers and card edges |
| **Text Primary** | `#242026` | Deep Charcoal — Primary readability text |
| **Text Secondary** | `#817985` | Muted Lavender Slate — Subheadings, timestamps, secondary labels |

---

## 🏗️ Technology Stack

```
RestaurantOS/
├── frontend/                     # Modern React 19 Single Page Application
│   ├── src/
│   │   ├── components/ui/        # Base UI + Shadcn component primitives
│   │   ├── context/              # AuthContext & ThemeContext
│   │   ├── layouts/              # MainLayout (Sidebar, Navbar, Mobile Drawer)
│   │   ├── pages/                # 10 core operations views
│   │   └── index.css             # Tailwind CSS v4 design tokens & fonts
│   └── vite.config.js            # Vite 8 + @tailwindcss/vite plugin
│
└── backend/                      # Production REST API
    ├── src/
    │   ├── config/               # MongoDB connection (with in-memory fallback)
    │   ├── controllers/          # Business logic handlers
    │   ├── middleware/           # JWT auth & Express rate limiter
    │   ├── models/               # Mongoose schemas (User, Table, Order, Menu, Inventory)
    │   └── routes/               # Express REST routers
    ├── seed.js                   # Automated seed dataset
    └── server.js                 # HTTP & database bootstrap
```

### Frontend Architecture
* **Framework:** [React 19](https://react.dev/) & [Vite 8](https://vitejs.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
* **UI Primitives:** [@base-ui/react](https://base-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Typography:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [Inter](https://fonts.google.com/specimen/Inter)
* **Data Visualization:** [Recharts](https://recharts.org/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

### Backend Architecture
* **Server:** [Express 5](https://expressjs.com/) on Node.js
* **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/)
* **Zero-Config Database Engine:** [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) (automatically initializes an in-memory database if no external MongoDB URI is provided)
* **Authentication:** JWT (JSON Web Tokens) with `bcrypt` salt hashing
* **Security & Reliability:** `helmet`, `cors`, and `express-rate-limit`

---

## ⚡ Quick Start & Installation

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/adityakaldhone09/RestaurantOS.git
cd RestaurantOS
```

### 2. Configure Environment Files

**Backend:**
```bash
cp backend/.env.example backend/.env
```
*(Default settings use port 5001 and automatically start the in-memory MongoDB engine—no local database installation required!)*

**Frontend:**
```bash
# Verify frontend/.env points to the backend proxy
echo "VITE_API_URL=/api" > frontend/.env
```

**MCP Tooling (Optional):**
```bash
cp .mcp.json.example .mcp.json
# Add your personal 21st.dev and Figma API keys if using MCP agents
```

### 3. Install Dependencies

```bash
# Install backend dependencies
npm --prefix backend install

# Install frontend dependencies
npm --prefix frontend install
```

### 4. Launch Development Servers

In terminal 1 (Backend API):
```bash
npm --prefix backend run dev
```
*Backend runs on `http://localhost:5001`. On first run, it automatically seeds initial dining tables, menu items, raw inventory, and staff accounts.*

In terminal 2 (Frontend Client):
```bash
npm --prefix frontend run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Pre-Seeded Demo Credentials

The database automatically seeds with 3 demo accounts for instant testing:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@restaurant.com` | `password123` | Full administrative access (All modules, settings, staff, telemetry) |
| **Manager** | `manager@restaurant.com` | `password123` | Operational management (Floor plan, inventory, catalog, POS) |
| **Waiter** | `waiter@restaurant.com` | `password123` | Floor operations (Dining tables, POS order creation, guest checkout) |

> 💡 **Quick Login:** The login screen (`/login`) includes 1-click demo login buttons to log in as any role without typing.

---

## 🔌 API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `POST` | `/api/auth/register` | Create a new team account | Yes (Admin) |
| `GET` | `/api/users` | List all staff members | Yes |
| `GET` | `/api/tables` | Fetch floor plan and table statuses | Yes |
| `POST` | `/api/tables` | Add a new dining table | Yes (Admin/Manager) |
| `PUT` | `/api/tables/:id/status` | Update seating status (`Available`, `Occupied`, `Reserved`) | Yes |
| `GET` | `/api/menu/items` | Fetch complete dish catalog | Yes |
| `POST` | `/api/menu/items` | Create new culinary item | Yes (Admin/Manager) |
| `PATCH` | `/api/menu/items/:id/availability` | Instant 86 toggle | Yes (Admin/Manager) |
| `GET` | `/api/orders` | Query orders with status filters | Yes |
| `POST` | `/api/orders` | Dispatch new POS table ticket | Yes |
| `PATCH` | `/api/orders/:id/status` | Advance lifecycle (`Confirmed` ➔ `Completed`) | Yes |
| `PATCH` | `/api/orders/:id/payment` | Settle bill via Cash/Card/UPI | Yes |
| `GET` | `/api/inventory` | List raw stock levels & threshold health | Yes |
| `PATCH` | `/api/inventory/:id/stock` | Restock ingredient quantity | Yes |
| `GET` | `/api/health` | Healthcheck endpoint | No |

---

## 🛠️ Build for Production

To create an optimized, minified production build:

```bash
npm --prefix frontend run build
```

Preview the production build locally:
```bash
npm --prefix frontend run preview
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
