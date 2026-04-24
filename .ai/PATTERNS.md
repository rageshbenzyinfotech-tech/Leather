# Code Patterns & Conventions

## File Organization

| Type | Location | Example |
|---|---|---|
| Pages | `src/app/<route>/page.tsx` | `src/app/products/page.tsx` |
| Layouts | `src/app/<route>/layout.tsx` | `src/app/admin/layout.tsx` |
| API routes | `src/app/api/<resource>/route.ts` | `src/app/api/products/route.ts` |
| Nested API routes | `src/app/api/<resource>/<action>/route.ts` | `src/app/api/cart/add/route.ts` |
| Components | `src/components/<Name>.tsx` | `src/components/Header.tsx` |
| React Context | `src/context/<Name>Context.tsx` | `src/context/StoreContext.tsx` |
| Utility/library | `src/lib/<name>.ts` | `src/lib/auth.ts` |
| Static data/types | `src/data/<name>.ts` | `src/data/products.ts` |
| Stylesheets | `src/styles/<section>.css` | `src/styles/header.css` |

## Naming Conventions

- **Files**: kebab-case for CSS (`product-detail.css`), PascalCase for components (`LoginModal.tsx`), camelCase for utilities (`prisma.ts`)
- **React components**: PascalCase (`StoreProvider`, `LoginModal`)
- **CSS classes**: BEM — `.block__element--modifier` (e.g., `.product-card__image-wrapper`)
- **CSS variables**: `--color-*`, `--font-*`, `--max-width`, `--transition-*`
- **Database columns**: snake_case (`discount_price`, `created_at`, `user_id`)
- **API responses**: JSON with snake_case keys matching database columns
- **URL slugs**: kebab-case, unique per product (`essential-slim-wallet`)

## Common Patterns

### Adding a New API Route

1. Create the route file at `src/app/api/<resource>/<action>/route.ts`
2. Import `NextResponse` from `next/server` and `prisma` from `@/lib/prisma`
3. For protected routes, verify the JWT token:
   ```typescript
   import { cookies } from 'next/headers';
   import { verifyToken } from '@/lib/auth';

   const token = (await cookies()).get('token')?.value;
   if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

   const payload = verifyToken(token);
   if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
   ```
4. For admin-only routes, add role check: `if (payload.role !== 'ADMIN') { ... }`
5. Wrap logic in try/catch and return `NextResponse.json()`
6. Always log errors with `console.error('<Context>:', error)`

### Adding a New Page

1. Create `src/app/<route>/page.tsx`
2. If the page needs client interactivity, add `'use client';` at the top
3. If the page uses cart/user state, import `useStore` from `@/context/StoreContext`
4. Create a corresponding CSS file in `src/styles/<page>.css` using BEM
5. Import the CSS in `src/app/layout.tsx` (globally) or the specific page

### Adding a New Database Model

1. Define the model in `prisma/schema.prisma` with UUID primary key: `@id @default(uuid())`
2. Add relations to existing models where needed
3. Run `npx prisma db push` to sync the schema
4. Run `npx prisma generate` to regenerate the client
5. Add seed data in `prisma/seed.js` if applicable
6. Access via `prisma.<modelName>.findMany()` etc. in API routes

### Protecting a Page with Auth

- **Edge level** (middleware): Add the route pattern to `matcher` in `src/middleware.ts`
- **API level**: Verify token and check role in each route handler
- **UI level**: Check `user` from `useStore()` and conditionally render or redirect

### Adding Items to Cart (Optimistic Update Pattern)

1. Update local state immediately via `setCart()` in `StoreContext`
2. If user is logged in, fire a background `fetch()` to sync with the database
3. After the API call, optionally re-fetch the full cart from DB for consistency

## Anti-Patterns (Don't Do This)

| Don't | Do Instead |
|---|---|
| Use `jsonwebtoken` in middleware | Use `jose` — middleware runs in Edge runtime |
| Use Tailwind utility classes | Write BEM CSS in `src/styles/` |
| Import from `prisma/schema.prisma` directly | Use `@prisma/client` generated types |
| Store secrets in `NEXT_PUBLIC_*` vars | Only expose the Razorpay public key to the browser |
| Use `raw SQL` or `prisma.$queryRaw` | Use Prisma's type-safe query builder |
| Create new pages without CSS | Always create a matching CSS file and import it |
| Hardcode database UUIDs | Use slugs for URLs, let Prisma generate UUIDs |
| Skip stock checks | Always verify `product.stock >= quantity` before cart add / checkout |

## Error Handling

- API routes: Wrap all logic in `try/catch`. Return `{ error: '<message>' }` with appropriate HTTP status (400, 401, 403, 500).
- Client-side: Use `.catch()` on fetch calls. Log errors with `console.error()`. Show user-friendly messages via state.
- Auth errors: Return 401 for missing/invalid tokens, 403 for insufficient role.

## Testing Conventions

- No automated test framework is currently configured
- Manual QA via browser: test login, browse, add to cart, checkout with Razorpay test card
- Use Prisma Studio (`npx prisma studio`) to verify database state
- Admin credentials for testing: `admin@zerano.com` / `admin123`
