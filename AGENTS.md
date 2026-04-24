# AGENTS.md

> This file provides context for AI coding agents working on this project.
> Read this file first before making any changes.

## Project Overview

Zerano is a full-stack eCommerce platform for premium leather goods (wallets, bags, belts, accessories). It features a customer-facing storefront with a dark, minimalist UI and a built-in admin dashboard. Payments are processed via Razorpay. The entire system is a monolithic Next.js application backed by PostgreSQL.

## Tech Stack

- **Framework**: Next.js (App Router) with TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Custom JWT (HTTP-only cookies) + edge-compatible `jose` for middleware
- **Payments**: Razorpay (Node SDK + Web Checkout)
- **Styling**: Vanilla CSS with BEM naming, dark-mode aesthetic, Google Fonts (Inter + Playfair Display)
- **Carousel**: Swiper.js
- **Package Manager**: npm

## Before You Start

1. Read `.ai/CONTEXT.md` for project constraints and environment setup
2. Read `.ai/ARCHITECTURE.md` for system design and data flows
3. Read `.ai/PATTERNS.md` for code conventions and rules
4. For specific subsystems, read the relevant file in `.ai/modules/`

## Critical Rules

1. **Always use Prisma** for all database queries — never write raw SQL
2. **Never expose secrets** in client-side code; use `NEXT_PUBLIC_` prefix only for public keys (e.g., Razorpay key ID)
3. **Verify JWT via `jose`** in middleware (edge runtime) and via `jsonwebtoken` in API routes (Node runtime)
4. **Admin routes** must validate `role === 'ADMIN'` from the JWT payload — both in middleware and in each API route handler
5. **Use `@/` path alias** for all imports (`@/` maps to `./src/`)
6. **CSS is vanilla CSS** with BEM naming — do not introduce Tailwind or CSS-in-JS
7. **All product prices** use `Float` type; `discount_price` is nullable
8. **Optimistic UI** for cart — update state immediately, sync to DB in background
9. **Slugs are unique** — always use `slug` for product URLs, never UUID
10. **Stock must be checked** before checkout and deducted after successful payment

## File Map

| Area | Key Files |
|---|---|
| Entry point / Home | `src/app/page.tsx`, `src/app/layout.tsx` |
| Products (pages) | `src/app/products/page.tsx`, `src/app/products/[slug]/page.tsx` |
| Cart & Checkout | `src/app/cart/`, `src/app/checkout/` |
| Auth UI | `src/components/LoginModal.tsx` |
| Admin panel | `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/app/admin/products/`, `src/app/admin/orders/`, `src/app/admin/users/` |
| API routes | `src/app/api/auth/`, `src/app/api/products/`, `src/app/api/cart/`, `src/app/api/orders/`, `src/app/api/payment/`, `src/app/api/admin/` |
| Shared components | `src/components/Header.tsx`, `src/components/Footer.tsx` |
| State management | `src/context/StoreContext.tsx` |
| Auth utilities | `src/lib/auth.ts`, `src/lib/prisma.ts` |
| Database schema | `prisma/schema.prisma` |
| Styles | `src/styles/` (17 CSS files, BEM naming) |
| Seed data | `prisma/seed.js` |

## Commands

| Action | Command |
|---|---|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Database push | `npx prisma db push` |
| Database seed | `node prisma/seed.js` |
| Prisma Studio | `npx prisma studio` |
| Generate client | `npx prisma generate` |
