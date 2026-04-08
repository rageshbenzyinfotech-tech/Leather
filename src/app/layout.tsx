import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StoreProvider } from '@/context/StoreContext';
import '@/styles/globals.css';
import '@/styles/header.css';
import '@/styles/footer.css';
import '@/styles/hero.css';
import '@/styles/categories.css';
import '@/styles/about.css';
import '@/styles/products.css';
import '@/styles/showcase.css';
import '@/styles/testimonials.css';
import '@/styles/cta.css';
import '@/styles/instagram.css';
import '@/styles/cart.css';
import '@/styles/checkout.css';
import '@/styles/product-detail.css';

export const metadata: Metadata = {
  title: 'Zerano | Crafted Leather',
  description: 'Premium minimalist leather goods including wallets, bags, and belts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}