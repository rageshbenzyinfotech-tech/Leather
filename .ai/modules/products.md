# Products & Catalog

## Purpose
Product catalog management — browsing, filtering, detail pages, and admin CRUD. Products are stored in PostgreSQL and fetched via API routes.

## Key Files
| File | Purpose |
|---|---|
| `prisma/schema.prisma` | `Product` model definition |
| `src/app/api/products/route.ts` | `GET` (list w/ category filter) + `POST` (admin create) |
| `src/app/api/products/[identifier]/route.ts` | `GET` (by slug/id) + `PUT` (update) + `DELETE` |
| `src/app/products/page.tsx` | Product listing page with category/sort filters |
| `src/app/products/[slug]/page.tsx` | Product detail page |
| `src/app/admin/products/` | Admin product management (CRUD UI) |
| `src/data/products.ts` | Legacy static product data (used as fallback on homepage) |
| `prisma/seed.js` | Seeds 8 products into the database |

## How It Works
- **Listing**: `GET /api/products?category=wallets` → Prisma `findMany` with `is_active: true` filter → returns JSON array
- **Detail**: Pages use `[slug]` dynamic route → fetch by slug → render with image gallery, pricing, stock info
- **Pricing**: `price` (original) and `discount_price` (nullable). Effective price = `discount_price ?? price`. Discount % = `((price - discount_price) / price) * 100`
- **Images**: Stored as `Json` (array of URL strings) in the database
- **Admin CRUD**: Protected by JWT role check; admin can create, update, delete products

## Configuration
- Product categories: `wallets`, `bags`, `belts`, `accessories` (stored as plain strings, not enum)
- Slugs must be unique (`@unique` constraint)
- `is_active` boolean controls visibility in the storefront

## Gotchas
- The homepage (`page.tsx`) uses hardcoded product data, NOT the API — this is for fast static rendering
- Product images are Unsplash URLs, not uploaded files — there's no image upload endpoint yet
- `discount_price` is `Float?` (nullable) — always check for null before calculating discounts
