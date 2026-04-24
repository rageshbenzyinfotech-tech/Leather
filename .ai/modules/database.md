# Database (Prisma + PostgreSQL)

## Purpose
Data persistence layer using Prisma ORM with PostgreSQL. Manages 7 models across the eCommerce domain.

## Key Files
| File | Purpose |
|---|---|
| `prisma/schema.prisma` | Schema definition — models, enums, relations |
| `src/lib/prisma.ts` | Singleton Prisma client (avoids connection exhaustion in dev) |
| `prisma/seed.js` | Seeds admin user, test customer, and 8 products |

## Models
| Model | Purpose | Key Fields |
|---|---|---|
| `User` | Customer/Admin accounts | email (unique), password_hash, role (USER/ADMIN) |
| `Product` | Product catalog | slug (unique), price, discount_price?, stock, images (Json), is_active |
| `Cart` | Per-user shopping cart | user_id (FK) |
| `CartItem` | Items in a cart | cart_id (FK), product_id (FK), quantity |
| `Order` | Completed orders | user_id (FK), total_amount, status (enum), payment_id |
| `OrderItem` | Items in an order | order_id (FK), product_id (FK), price (snapshot), quantity |
| `Wishlist` | Saved products | user_id (FK), product_id (FK) |

## Enums
- `Role`: `USER`, `ADMIN`
- `OrderStatus`: `PENDING`, `PAID`, `FAILED`, `SHIPPED`

## Prisma Client Singleton Pattern
```typescript
// src/lib/prisma.ts — prevents connection leaks during hot reload
const prisma = globalThis.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
```

## Common Tasks
### Add a new model
1. Define in `prisma/schema.prisma` with `@id @default(uuid())`
2. Add relations to existing models
3. Run `npx prisma db push` then `npx prisma generate`
4. Add seed data in `prisma/seed.js` if needed

### Inspect database
```bash
npx prisma studio  # Opens web UI on localhost:5555
```

## Gotchas
- All IDs are UUIDs (strings), not auto-increment integers
- `images` field is `Json` type — stored as JSON array of URL strings
- `discount_price` is nullable — always handle the null case
- Prisma client must be imported from `@/lib/prisma`, not instantiated directly
- The seed script uses `upsert` so it's safe to run multiple times
