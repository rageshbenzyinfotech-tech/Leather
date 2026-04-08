import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="/" className="footer__logo">Zerano</Link>
            <p className="footer__desc">Premium leather goods designed for longevity and minimal aesthetic. Built for the modern journey.</p>
          </div>
          
          <nav className="footer__nav" aria-label="Footer Shop Links">
            <h3 className="footer__title">Shop</h3>
            <ul className="footer__list">
              <li><Link href="/products">Wallets</Link></li>
              <li><Link href="/products">Bags</Link></li>
              <li><Link href="/products">Belts</Link></li>
              <li><Link href="/products">Accessories</Link></li>
            </ul>
          </nav>
          
          <nav className="footer__nav" aria-label="Footer About Links">
            <h3 className="footer__title">About</h3>
            <ul className="footer__list">
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/about">Craftsmanship</Link></li>
              <li><Link href="/about">Sustainability</Link></li>
              <li><Link href="/about">Journal</Link></li>
            </ul>
          </nav>
          
          <nav className="footer__nav" aria-label="Footer Support Links">
            <h3 className="footer__title">Support</h3>
            <ul className="footer__list">
              <li><Link href="/contact">FAQ</Link></li>
              <li><Link href="/contact">Shipping</Link></li>
              <li><Link href="/contact">Returns</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </nav>
        </div>
        
        <div className="footer__bottom">
          <p>&copy; 2026 Zerano Leather. All rights reserved.</p>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="Pinterest">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}