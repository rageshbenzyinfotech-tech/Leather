# Admin Panel

## Purpose
Dashboard for managing the store — viewing stats, CRUD for products, managing orders, and user roles. Accessible only to users with `ADMIN` role.

## Key Files
| File | Purpose |
|---|---|
| `src/app/admin/layout.tsx` | Admin layout with sidebar navigation |
| `src/app/admin/page.tsx` | Dashboard — total orders, revenue, user count |
| `src/app/admin/products/` | Product CRUD interface |
| `src/app/admin/orders/` | Order listing and status management |
| `src/app/admin/users/` | User listing and role management |
| `src/app/api/admin/stats/route.ts` | Dashboard statistics endpoint |
| `src/app/api/admin/users/route.ts` | User management endpoint |
| `src/styles/admin.css` | Admin-specific styles |

## How It Works
- **Layout**: Sidebar with links to Dashboard, Products, Orders, Users, and "Back to Store"
- **Protection**: Dual-layer — Edge middleware verifies `ADMIN` role, API routes also check role
- **Stats**: Aggregates from Prisma (`count`, `aggregate`) for revenue, order count, user count
- **Product CRUD**: Uses the same `/api/products` endpoints as the storefront, with admin-only POST/PUT/DELETE
- **Order Management**: Lists all orders with status badges; admin can update status (PENDING → PAID → SHIPPED)
- **User Management**: Lists all users; admin can change roles between USER and ADMIN

## Common Tasks
### Adding a new admin section
1. Create `src/app/admin/<section>/page.tsx`
2. Add a nav link in `src/app/admin/layout.tsx` in the `links` array
3. Create corresponding API route if needed at `src/app/api/admin/<section>/route.ts`

## Gotchas
- Admin layout is `'use client'` — it uses `usePathname()` for active link highlighting
- The sidebar nav uses `isActive()` logic: exact match for `/admin`, prefix match for sub-routes
- Admin CSS is imported in the admin layout, not in the root layout
