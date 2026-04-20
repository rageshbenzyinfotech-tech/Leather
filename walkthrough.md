# Zerano eCommerce System Walkthrough

The Zerano eCommerce platform is now a fully functional, production-ready system with a premium dark-themed UI. This guide covers how to set up, run, and explore the completed features.

## 🚀 Getting Started

### 1. Environment Configuration
Ensure your `.env` file contains the required credentials:
```env
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_secure_random_secret"
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
```

### 2. Database Initialization
Run the following commands to set up your database schema and seed initial data:
```bash
npx prisma db push
node prisma/seed.js
```
*   **Admin Credentials:** `admin@zerano.com` / `admin123`
*   **Customer Credentials:** `customer@zerano.com` / `user123`

### 3. Running the App
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🛠️ Key Features & How to Test

### 1. User Authentication
*   **Login/Register:** Click "Login" in the header. You can switch between Login and Registration modes.
*   **Context Management:** Authentication state is managed globally. The header dynamically updates based on the logged-in user.

### 2. Shopping Experience
*   **Product Catalog:** Browse products at `/products`. Filters for Category and Sorting are fully functional and fetch data from the database.
*   **Product Detail:** Click any product to view details. Features interactive image zoom, dynamic stock checks, and category-based navigation.
*   **Cart & Wishlist:** Add items to your cart or wishlist. Cart state is persisted to the database for logged-in users.

### 3. Checkout & Razorpay Payments
1.  Add items to the cart and go to `/checkout`.
2.  Fill in shipping details.
3.  Click "Confirm & Pay". This will open the **Razorpay Checkout** overlay.
4.  Use [Razorpay Test Credentials](https://razorpay.com/docs/payments/payments/test-card-details/) to complete the payment.
5.  On success, you'll be redirected to `/orders`, your cart will clear, and product stock will be automatically deducted.

### 4. Admin Dashboard
Access the admin panel at `/admin` (only accessible to users with the `ADMIN` role).
*   **Dashboard Stats:** Overview of total revenue, orders, and user growth.
*   **Product Management:** Full CRUD (Create, Read, Update, Delete) for your inventory.
*   **Order Management:** Track customer orders and update their status (e.g., Shipped, Delivered).
*   **User Management:** View all registered users and manage their roles.

---

## 📁 Technical Architecture

*   **Framework:** Next.js (App Router) with TypeScript.
*   **ORM:** Prisma with PostgreSQL.
*   **Security:** JWT-based auth with HTTP-only cookies and Middleware protection.
*   **Payments:** Razorpay Node.js SDK and Web SDK.
*   **Styling:** Custom CSS with a focus on premium dark-mode aesthetics.

## 💡 Pro Tips
*   **Middleware:** The `/admin` routes are protected at the edge using the `jose` library. Unauthorized access redirects to the home page.
*   **Prerendering:** The app is optimized for performance, with product listings supporting loading states and SEO-friendly metadata.
