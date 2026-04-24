# Cart & Checkout

## Purpose
Shopping cart with optimistic UI updates and database sync for logged-in users. Checkout integrates with Razorpay for payment processing.

## Key Files
| File | Purpose |
|---|---|
| `src/context/StoreContext.tsx` | Cart state, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()` |
| `src/app/api/cart/route.ts` | `GET` (fetch cart) + `DELETE` (clear cart) |
| `src/app/api/cart/add/route.ts` | `POST` — add item to cart (with stock check) |
| `src/app/api/cart/remove/route.ts` | `POST` — remove item from cart |
| `src/app/api/cart/update/route.ts` | `POST` — update item quantity |
| `src/app/cart/` | Cart page |
| `src/app/checkout/` | Checkout page with shipping form + Razorpay |
| `src/app/api/payment/create-order/route.ts` | Creates a Razorpay order |
| `src/app/api/payment/verify/route.ts` | Verifies Razorpay signature, creates Order, deducts stock |
| `src/styles/cart.css`, `src/styles/checkout.css` | Styles |

## How It Works

### Cart (Optimistic Update Pattern)
1. **Add to cart**: `StoreContext.addToCart()` updates local state immediately
2. If user is logged in, fires `POST /api/cart/add` in background
3. API checks stock availability, creates/finds user's Cart, upserts CartItem
4. After API call, `fetchCart()` re-syncs from DB to get `cart_item_id`s

### Checkout Flow
1. User views cart → navigates to `/checkout`
2. Fills shipping details
3. Clicks "Confirm & Pay" → `POST /api/payment/create-order` → returns Razorpay `order_id`
4. Frontend opens Razorpay Checkout popup
5. User pays → Razorpay returns `payment_id`, `order_id`, `signature`
6. Frontend calls `POST /api/payment/verify` with these values
7. Backend verifies HMAC signature → creates `Order` + `OrderItem`s → deducts product stock → clears cart
8. Frontend clears local cart → redirects to `/orders`

## Common Tasks
### Adding a cart item (API pattern)
```typescript
// 1. Verify JWT
// 2. Check product exists and stock >= quantity
// 3. Find or create user's Cart
// 4. Upsert CartItem (increment if exists, create if new)
```

## Gotchas
- **Guest cart**: Stored only in `localStorage` — not synced to DB until user logs in
- **Cart sync**: After login, the frontend re-fetches the DB cart, which may differ from localStorage
- **Stock validation**: Checked on add-to-cart AND on payment verification — not on page load
- **Cart item identity**: Uses composite of `product.id + color` for local state, `cart_item_id` for DB operations
