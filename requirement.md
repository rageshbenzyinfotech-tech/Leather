Good choices — this stack is solid and production-ready if designed properly. I’ll give you a **clear, structured System Requirement Document (SRD)** tailored for **Google Antigravity (agentic IDE)** so it can generate your backend + admin + integrations correctly.

---

# 📄 SYSTEM REQUIREMENT DOCUMENT

### 🛒 Custom Shopify-like eCommerce System

**Project Type:** Full-stack (Next.js + PostgreSQL + Razorpay)
**Architecture:** Monolithic (Frontend + Backend + Admin in same project)

---

# 1. 🎯 OBJECTIVE

Build a **scalable eCommerce platform similar to Shopify** with:

* User authentication
* Product catalog
* Shopping cart & checkout
* Razorpay payment integration
* Admin dashboard (inventory + orders)
* PostgreSQL database

---

# 2. 🧱 TECH STACK

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes (or Route Handlers)
* Node.js runtime

### Database

* PostgreSQL
* ORM: Prisma (recommended)

### Authentication

* JWT (custom) or NextAuth

### Payment

* Razorpay

### Hosting (optional suggestion)

* Vercel (frontend + API)
* Railway / Supabase (PostgreSQL)

---

# 3. 🏗️ SYSTEM ARCHITECTURE

```
Client (Browser)
   ↓
Next.js Frontend (UI + State)
   ↓
API Layer (Next.js Route Handlers)
   ↓
Business Logic Layer
   ↓
Prisma ORM
   ↓
PostgreSQL Database
   ↓
External Services (Razorpay)
```

---

# 4. 👤 USER ROLES

## 4.1 Customer

* Register/Login
* Browse products
* Add to cart
* Checkout
* View orders

## 4.2 Admin

* Manage products
* Manage inventory
* View/manage orders
* Manage users

---

# 5. 🗄️ DATABASE DESIGN (PostgreSQL)

## 5.1 Users Table

```
id (UUID, PK)
name
email (unique)
password_hash
role (USER / ADMIN)
created_at
updated_at
```

---

## 5.2 Products Table

```
id (UUID, PK)
name
slug (unique)
description
price
discount_price
stock
category
images (JSON)
is_active (boolean)
created_at
updated_at
```

---

## 5.3 Cart Table

```
id (UUID, PK)
user_id (FK)
created_at
```

## 5.4 Cart Items

```
id (UUID, PK)
cart_id (FK)
product_id (FK)
quantity
```

---

## 5.5 Orders Table

```
id (UUID, PK)
user_id (FK)
total_amount
status (PENDING / PAID / FAILED / SHIPPED)
payment_id (Razorpay)
created_at
```

---

## 5.6 Order Items

```
id (UUID, PK)
order_id (FK)
product_id (FK)
price
quantity
```

---

## 5.7 Wishlist Table

```
id (UUID, PK)
user_id (FK)
product_id (FK)
```

---

# 6. 🔌 API REQUIREMENTS

## 6.1 Auth APIs

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

---

## 6.2 Product APIs

```
GET    /api/products
GET    /api/products/:slug
POST   /api/products        (Admin)
PUT    /api/products/:id    (Admin)
DELETE /api/products/:id    (Admin)
```

---

## 6.3 Cart APIs

```
GET    /api/cart
POST   /api/cart/add
POST   /api/cart/remove
POST   /api/cart/update
```

---

## 6.4 Order APIs

```
POST   /api/orders/create
GET    /api/orders
GET    /api/orders/:id
```

---

## 6.5 Payment APIs (Razorpay)

```
POST   /api/payment/create-order
POST   /api/payment/verify
```

---

# 7. 💳 RAZORPAY INTEGRATION FLOW

### Step 1: Create Order

* Backend calls Razorpay API
* Returns `order_id`

### Step 2: Frontend Payment

* Razorpay checkout opens

### Step 3: Verify Payment

* Validate signature on backend

### Step 4: Update Order Status

```
PENDING → PAID
```

---

# 8. 🖥️ FRONTEND REQUIREMENTS

## Pages

* Home
* Product Listing
* Product Detail
* Cart
* Checkout
* Login/Register
* Orders Page

---

## Features

* Responsive design
* SEO-friendly routes
* Loading states
* Error handling

---

# 9. 🛠️ ADMIN PANEL (INSIDE SAME PROJECT)

### Route:

```
/admin
```

## Features

### Dashboard

* Total orders
* Revenue
* Users count

---

### Product Management

* Add product
* Edit product
* Delete product
* Upload images

---

### Order Management

* View all orders
* Update order status

---

### User Management

* View users
* Change roles

---

# 10. 🔐 AUTHENTICATION & AUTHORIZATION

### Authentication

* JWT stored in HTTP-only cookies

### Authorization

* Middleware to protect:

```
/admin/*
```

---

# 11. ⚙️ BUSINESS LOGIC RULES

* Prevent checkout if stock = 0
* Deduct stock after successful payment
* Cart auto-clears after order
* Unique slug for products
* Email must be unique

---

# 12. 🚀 PERFORMANCE REQUIREMENTS

* API response < 300ms
* Use caching for product listing
* Lazy load images
* Optimize DB queries (indexes on slug, user_id)

---

# 13. 🧪 TESTING REQUIREMENTS

* Unit tests for APIs
* Integration test for payment flow
* Manual QA for checkout

---

# 14. 🔒 SECURITY REQUIREMENTS

* Hash passwords (bcrypt)
* Validate all inputs
* Prevent SQL injection (Prisma safe)
* Use HTTPS
* Verify Razorpay signature

---

# 15. 📦 DEPLOYMENT REQUIREMENTS

### Environment Variables

```
DATABASE_URL=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---
