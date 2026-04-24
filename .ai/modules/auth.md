# Authentication & Authorization

## Purpose
Custom JWT-based auth using HTTP-only cookies. Dual-library: `jsonwebtoken` (Node API routes) and `jose` (Edge middleware).

## Key Files
| File | Purpose |
|---|---|
| `src/lib/auth.ts` | `signToken()` / `verifyToken()` via `jsonwebtoken` |
| `src/middleware.ts` | Edge middleware protecting `/admin/*` via `jose` |
| `src/app/api/auth/login/route.ts` | Login endpoint |
| `src/app/api/auth/register/route.ts` | Registration endpoint |
| `src/app/api/auth/me/route.ts` | Session check |
| `src/app/api/auth/logout/route.ts` | Clears token cookie |
| `src/components/LoginModal.tsx` | Login/Register UI modal |
| `src/context/StoreContext.tsx` | Client-side auth state |

## How It Works
1. **Register/Login**: Client sends credentials → API hashes/verifies password → signs JWT `{id, email, role}` → sets `token` HTTP-only cookie (7d expiry)
2. **Session**: `StoreContext.refreshUser()` calls `GET /api/auth/me` on mount → reads cookie → verifies JWT → returns user
3. **Admin Protection**: `middleware.ts` intercepts `/admin/*` → reads cookie → verifies with `jose` → checks `role === 'ADMIN'` → allows or redirects to `/`

## JWT Payload
```json
{ "id": "<uuid>", "email": "user@example.com", "role": "USER | ADMIN" }
```

## Common Tasks
### Protect a new API route
```typescript
const token = (await cookies()).get('token')?.value;
if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const payload = verifyToken(token);
if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
```

## Gotchas
- `jsonwebtoken` does NOT work in Edge runtime — middleware must use `jose`
- Cookie access requires `await cookies()` in Next.js 15+
- No refresh token — users must re-login after 7 days
