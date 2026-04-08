import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Our <span className="font-serif italic text-muted">Story</span><span className="dot">.</span></h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="about__container">
            <h2 className="about__title">The <span className="font-serif italic text-muted">art of</span> <span className="accent-color font-serif italic">simplicity</span><span className="dot">.</span></h2>
            <p className="about__text">
              We believe in doing more with less. Every piece is meticulously crafted by master artisans using sustainably sourced materials, ensuring your everyday carry ages beautifully alongside you.
            </p>
            <p className="about__text" style={{ marginTop: '1.5rem' }}>
              Founded in 2018, Zerano began with a simple question: why can't everyday carry be both beautiful and functional? We set out to create leather goods that don't just hold your essentials—they become a part of your story.
            </p>
          </div>
        </div>
      </section>

      <section className="showcase">
        <div className="showcase__image-wrapper">
          <img src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1600&auto=format&fit=crop" alt="Leather craftsmanship" className="showcase__image" />
          <div className="showcase__overlay">
            <h2 className="showcase__title">Craftsmanship</h2>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about__container">
            <h2 className="about__title">Sustainable <span className="font-serif italic text-muted">Quality</span><span className="dot">.</span></h2>
            <p className="about__text">
              We're committed to sourcing only the finest vegetable-tanned leathers from tanneries that share our values. Every cut, stitch, and burnish is done by hand in our workshop, ensuring each piece meets our exacting standards.
            </p>
            <p className="about__text" style={{ marginTop: '1.5rem' }}>
              We believe in creating products that last a lifetime—not through trends, but through timeless design and uncompromising quality. When you carry Zerano, you're carrying a piece of our story.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}