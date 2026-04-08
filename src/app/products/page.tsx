'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const products = [
  {
    id: 'essential-slim-wallet',
    title: 'Essential Slim Wallet',
    price: 65,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
    colors: ['black', 'brown', 'tan'],
    category: 'wallets'
  },
  {
    id: 'the-weekender',
    title: 'The Weekender',
    price: 345,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop',
    colors: ['brown', 'black'],
    category: 'bags'
  },
  {
    id: 'classic-leather-belt',
    title: 'Classic Leather Belt',
    price: 85,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    colors: ['black', 'tan'],
    category: 'belts'
  },
  {
    id: 'minimalist-cardholder',
    title: 'Minimalist Cardholder',
    price: 45,
    image: 'https://images.unsplash.com/photo-1628149462153-29ecda955685?q=80&w=600&auto=format&fit=crop',
    colors: ['tan', 'black', 'maroon', 'dual'],
    category: 'wallets'
  }
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [displayedProducts, setDisplayedProducts] = useState(products);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilter(category);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = products.filter(p => {
      return filter === 'all' || p.category === filter;
    });

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setDisplayedProducts(filtered);
  }, [filter, sort]);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">The <span className="font-serif italic text-muted">Core</span> <span className="accent-color font-serif italic">Collection</span><span className="dot">.</span></h1>
          <p className="page-subtitle">Premium Leather Goods</p>
        </div>
      </div>

      <section className="container shop-layout">
        <aside className="filters">
          <div className="filter-group">
            <h3 className="filter-title">Category</h3>
            <ul className="filter-list" id="category-filters">
              <li><a href="#" className={filter === 'all' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setFilter('all'); }}>All Products</a></li>
              <li><a href="#" className={filter === 'wallets' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setFilter('wallets'); }}>Wallets</a></li>
              <li><a href="#" className={filter === 'bags' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setFilter('bags'); }}>Bags</a></li>
              <li><a href="#" className={filter === 'belts' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setFilter('belts'); }}>Belts</a></li>
              <li><a href="#" className={filter === 'accessories' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setFilter('accessories'); }}>Accessories</a></li>
            </ul>
          </div>

          <div className="filter-group" style={{ marginTop: '3rem' }}>
            <h3 className="filter-title">Sort By</h3>
            <ul className="filter-list" id="sort-filters">
              <li><a href="#" className={sort === 'default' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setSort('default'); }}>Featured</a></li>
              <li><a href="#" className={sort === 'price-asc' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setSort('price-asc'); }}>Price: Low to High</a></li>
              <li><a href="#" className={sort === 'price-desc' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setSort('price-desc'); }}>Price: High to Low</a></li>
            </ul>
          </div>
        </aside>

        <div className="products__grid">
          {displayedProducts.map((product) => (
            <article key={product.id} className="product-card">
              <Link href={`/products/${product.id}`} className="product-card__link">
                <div className="product-card__image-wrapper">
                  <img src={product.image} alt={product.title} className="product-card__image" loading="lazy" />
                </div>
                <div className="product-card__info">
                  <h3 className="product-card__title">{product.title}</h3>
                  <p className="product-card__price">${product.price}.00</p>
                  {product.colors && (
                    <div className="product-card__colors">
                      {product.colors.map((color, index) => (
                        <span key={color} className={`swatch swatch--${color} ${index === 0 ? 'is-active' : ''}`}></span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}