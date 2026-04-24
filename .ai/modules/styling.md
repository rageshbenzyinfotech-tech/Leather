# Styling & Design System

## Purpose
Premium dark-mode UI built with vanilla CSS, BEM naming, and CSS custom properties. Inspired by high-end leather brand aesthetics.

## Key Files
| File | Purpose |
|---|---|
| `src/styles/globals.css` | Design tokens (colors, fonts, transitions), reset, base utilities |
| `src/styles/header.css` | Header, navigation, mega-menu, cart dropdown |
| `src/styles/footer.css` | Footer layout |
| `src/styles/hero.css` | Hero banner section |
| `src/styles/products.css` | Product cards grid/carousel |
| `src/styles/product-detail.css` | Single product detail page |
| `src/styles/cart.css` | Cart page |
| `src/styles/checkout.css` | Checkout page |
| `src/styles/admin.css` | Admin panel sidebar + dashboard |
| `src/styles/login-modal.css` | Auth modal |
| Other CSS files | Section-specific styles (about, categories, cta, etc.) |

## Design Tokens (CSS Custom Properties)
```css
--color-bg: #111213;          /* Near-black background */
--color-text: #fdfdfd;        /* Off-white text */
--color-text-muted: #888888;  /* Muted gray text */
--color-gray-50: #161718;     /* Card backgrounds */
--color-gray-100: #1c1d1e;    /* Subtle borders/dividers */
--color-accent: #e55f30;      /* Burnt orange accent */
--font-main: 'Inter', sans-serif;
--font-serif: 'Playfair Display', serif;
--transition-smooth: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
--transition-fast: all 0.2s ease;
```

## How It Works
- **BEM Naming**: `.block__element--modifier` — e.g., `.product-card__image-wrapper`, `.btn--primary`
- **Import Order**: All CSS files are imported in `src/app/layout.tsx` (globals first, then section-specific)
- **No Tailwind**: All styles are hand-written vanilla CSS
- **Responsive**: Uses `clamp()` for fluid typography, `@media` breakpoints at `576px` and `992px`
- **Google Fonts**: Inter (sans) for body, Playfair Display (serif) for headings/accents
- **Background**: Dark with subtle radial gradient + SVG noise texture overlay

## Common Tasks
### Adding styles for a new page
1. Create `src/styles/<page-name>.css`
2. Use BEM: `.page-name__element--modifier`
3. Use existing design tokens (`var(--color-accent)`, etc.)
4. Import in `src/app/layout.tsx`: `import '@/styles/<page-name>.css';`

## Gotchas
- CSS is globally scoped — ensure class names are unique via BEM
- The admin panel imports its CSS in admin `layout.tsx`, not the root layout
- Color swatches (`.swatch--black`, etc.) are hardcoded CSS classes, not dynamic
