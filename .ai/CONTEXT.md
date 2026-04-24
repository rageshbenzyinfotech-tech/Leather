# Project Context

## Environment

- **OS**: Windows (primary development)
- **Runtime**: Node.js (LTS recommended)
- **Database**: PostgreSQL 15+ running locally on port 5432
- **No Docker** — the project runs directly on the host machine
- **Browser**: Any modern browser; no SSR-specific requirements beyond standard Next.js

## Dependencies & Infrastructure

### Database
- **PostgreSQL** on `localhost:5432`, database name `ecommerce`, schema `public`
- Connection string pattern: `postgresql://<user>:<pass>@localhost:5432/ecommerce?schema=public`
- Managed via Prisma ORM — schema at `prisma/schema.prisma`

### External APIs
- **Razorpay**: Payment gateway. Requires `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (test keys work for development). The frontend loads the Razorpay web checkout script via `<script>` tag.

### Key npm Dependencies
| Package | Purpose |
|---|---|
| `next` (latest) | Framework (App Router) |
| `react` / `react-dom` | UI rendering |
| `@prisma/client` + `prisma` | ORM and database client |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT sign/verify in API routes (Node runtime) |
| `jose` | JWT verify in middleware (Edge runtime) |
| `cookie` | Cookie parsing |
| `razorpay` | Razorpay Node SDK for server-side order creation |
| `swiper` | Product carousel on the homepage |

## Development Setup

1. **Clone the repo** and navigate to the project root
2. **Install dependencies**: `npm install`
3. **Configure environment**: Copy `.env` and fill in real values:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce?schema=public"
   JWT_SECRET="<random-secure-string>"
   RAZORPAY_KEY_ID="rzp_test_..."
   RAZORPAY_KEY_SECRET="<your-razorpay-secret>"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
   ```
4. **Push schema to DB**: `npx prisma db push`
5. **Seed the database**: `node prisma/seed.js`
   - Admin: `admin@zerano.com` / `admin123`
   - Customer: `customer@zerano.com` / `user123`
6. **Start dev server**: `npm run dev` → opens at `http://localhost:3000`

## Deployment

- **Frontend + API**: Vercel (recommended) — Next.js native hosting
- **Database**: Railway, Supabase, or any managed PostgreSQL
- Ensure all environment variables are set in the hosting platform
- Run `npx prisma db push` against the production database before first deployment

## Constraints

- **No Tailwind CSS** — the project uses vanilla CSS with BEM naming
- **No NextAuth** — auth is custom JWT-based
- **Monolithic architecture** — frontend, API, and admin are all in the same Next.js app
- **Currency**: Indian Rupees (₹) — all prices stored in INR
- **Images**: Hosted on Unsplash CDN (no local image uploads currently); product images stored as JSON array of URLs in the database
- **Edge middleware** uses `jose` (not `jsonwebtoken`) because the Edge runtime doesn't support Node.js crypto modules

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for signing/verifying JWTs | Yes |
| `RAZORPAY_KEY_ID` | Razorpay API key (server-side) | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (server-side) | Yes |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key exposed to the browser for checkout | Yes |
