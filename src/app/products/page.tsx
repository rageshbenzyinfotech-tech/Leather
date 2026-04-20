'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setAllProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilter(category);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = allProducts.filter(p => {
      return filter === 'all' || p.category === filter;
    });

    if (sort === 'price-asc') {
      filtered.sort((a, b) => {
        const priceA = a.discount_price ?? a.price;
        const priceB = b.discount_price ?? b.price;
        return priceA - priceB;
      });
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => {
        const priceA = a.discount_price ?? a.price;
        const priceB = b.discount_price ?? b.price;
        return priceB - priceA;
      });
    }

    setDisplayedProducts(filtered);
  }, [filter, sort, allProducts]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
        <p className="page-subtitle">Curating products...</p>
      </div>
    );
  }

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
          {displayedProducts.map((product) => {
            const firstImage = product.images && product.images.length > 0 ? product.images[0] : '';
            return (
              <article key={product.id} className="product-card">
                <Link href={`/products/${product.slug}`} className="product-card__link">
                  <div className="product-card__image-wrapper">
                    <img src={firstImage} alt={product.name} className="product-card__image" loading="lazy" />
                  </div>
                  <div className="product-card__info">
                    <h3 className="product-card__title">{product.name}</h3>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <p className="product-card__price">₹{(product.discount_price ?? product.price).toLocaleString('en-IN')}</p>
                      {product.discount_price && (
                        <>
                          <p className="product-card__price text-muted" style={{ textDecoration: 'line-through', fontSize: '0.8rem' }}>₹{product.price.toLocaleString('en-IN')}</p>
                          <p style={{ fontSize: '0.75rem', color: '#ff4d4d', fontWeight: '600' }}>{Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF</p>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">The <span className="font-serif italic text-muted">Core</span> <span className="accent-color font-serif italic">Collection</span><span className="dot">.</span></h1>
          <p className="page-subtitle">Loading...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}