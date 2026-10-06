import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDiscipline, setActiveDiscipline] = useState('all');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('/api/products');
        // Get high performance showcase products
        setFeaturedProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to deploy weapon inventory. Please check connectivity.');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = activeDiscipline === 'all'
    ? featuredProducts.slice(0, 4)
    : featuredProducts.filter(p => p.discipline?.toLowerCase() === activeDiscipline.toLowerCase()).slice(0, 4);

  return (
    <div className="home-page-wrapper">
      {/* Dynamic Split Hero Section */}
      <section className="hero">
        <img 
          className="hero-bg" 
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop" 
          alt="AMI high-performance arena"
        />
        <div className="container">
          <span className="eyebrow">ELITE ATHLETIC ARMORY</span>
          <h1>Engineered to <span className="gradient-text">DOMINATE</span></h1>
          <p className="hero-subtitle">
            Uncompromising composite field hockey sticks, hyper-tuned padel rackets, and custom team armor. Developed for athletes who demand mathematical precision and raw power.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="btn-primary">EXPLORE ARSENAL</Link>
            <Link to="/customizer" className="btn-secondary">CUSTOM TEAM KIT</Link>
          </div>
        </div>
      </section>

      {/* Brand Technical Stats */}
      <section className="section stats-bar-section">
        <div className="container">
          <div className="grid grid-4">
            <div className="stat-card">
              <span className="stat-value">95%</span>
              <span className="stat-label">ULTRA-HIGH CARBON RATIO</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">0.02s</span>
              <span className="stat-label">REBOUND RECOVERY RATE</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">12.8%</span>
              <span className="stat-label">VIBRATION DAMPENING COAT</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">340+</span>
              <span className="stat-label">PRO CLUBS RIGGED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Dualism: Discipline Selectors */}
      <section className="section discipline-dualism">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">CHOOSE YOUR DISCIPLINE</span>
            <h2>Select Your <span className="gradient-text">Specialty</span></h2>
            <p className="section-subtitle">Tactical equipment calibrated specifically for court dominance or field superiority.</p>
          </div>

          <div className="grid grid-2">
            <div className="feature-card interactive-discipline-card">
              <img 
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop" 
                alt="Field Hockey Action" 
                className="discipline-card-bg"
              />
              <div className="discipline-card-content">
                <span className="badge">OUTDOOR & INDOOR</span>
                <h3>FIELD HOCKEY</h3>
                <p>Extreme low bow sticks, 3D aerial geometry, and Japanese Toray Carbon reinforcements.</p>
                <button 
                  onClick={() => { setActiveDiscipline('hockey'); navigate('/catalog?discipline=hockey'); }} 
                  className="btn-primary"
                >
                  DEGRADE THE DEFENSE
                </button>
              </div>
            </div>

            <div className="feature-card interactive-discipline-card">
              <img 
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop" 
                alt="Padel Court Action" 
                className="discipline-card-bg"
              />
              <div className="discipline-card-content">
                <span className="badge">COURT WARFARE</span>
                <h3>PADEL RACKETS</h3>
                <p>Teardrop & Diamond molds built with HR3 EVA core density and 18K Carbon woven faces.</p>
                <button 
                  onClick={() => { setActiveDiscipline('padel'); navigate('/catalog?discipline=padel'); }} 
                  className="btn-primary"
                >
                  CONQUER THE COURT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase with Embedded Video Spec */}
      <section className="section tech-showcase">
        <div className="container">
          <div className="grid grid-2">
            <div className="tech-info-column">
              <span className="eyebrow">AMI LABS PATENTED</span>
              <h2>Scientific Innovation Over <span className="gradient-text">Guesswork</span></h2>
              <p>
                At AMI, we do not follow aesthetic trends. Every stick curve, padel face hole distribution, and textile weave is calculated using finite element analysis (FEA) to maximize kinetic transfer.
              </p>
              
              <div className="tech-feature-item">
                <div className="feature-number">01</div>
                <div>
                  <h4>Kevlar Reinforcement Spine</h4>
                  <p>Strategically woven along the high-impact zones to absorb shockwaves and preserve wrist longevity.</p>
                </div>
              </div>

              <div className="tech-feature-item">
                <div className="feature-number">02</div>
                <div>
                  <h4>Aero-Dynamic Vent Porting</h4>
                  <p>Decreased air resistance by 8.4% allowing lightning-fast swing speeds and supreme high-ball response.</p>
                </div>
              </div>

              <div className="tech-feature-item">
                <div className="feature-number">03</div>
                <div>
                  <h4>Hyper-Grit Surface Tactility</h4>
                  <p>A specialized micro-abrasion layer that guarantees maximum ball traction under intense moisture conditions.</p>
                </div>
              </div>
            </div>

            <div className="tech-media-column">
              <div className="video-embed">
                <iframe 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="AMI Engineering Lab Video" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="media-caption">
                <strong>INSIDE THE AMI TUNNEL:</strong> Stress-testing our 100% carbon structures against 140km/h impacts.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Mini Catalog Preview */}
      <section className="section curated-products">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">THE STOCK ARSENAL</span>
            <h2>Top-Tier <span className="gradient-text">Hardware</span></h2>
            <p className="section-subtitle">Immediate dispatch weapons selected by international tactical coaches.</p>
            
            <div className="filter-bar">
              <button 
                onClick={() => setActiveDiscipline('all')} 
                className={activeDiscipline === 'all' ? 'active' : ''}
              >
                All Weapons
              </button>
              <button 
                onClick={() => setActiveDiscipline('hockey')} 
                className={activeDiscipline === 'hockey' ? 'active' : ''}
              >
                Hockey Sticks
              </button>
              <button 
                onClick={() => setActiveDiscipline('padel')} 
                className={activeDiscipline === 'padel' ? 'active' : ''}
              >
                Padel Rackets
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <span className="loading-spinner"></span>
              <p>Synthesizing product matrices...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="alert alert-info">
              No weapons matching this filter are currently in stock. Check back shortly.
            </div>
          ) : (
            <div className="grid grid-4">
              {filteredProducts.map((product) => (
                <div className="card product-card animate-in" key={product._id}>
                  <div className="product-image-container">
                    <img 
                      src={product.images || 'https://picsum.photos/seed/product/600/400'} 
                      alt={product.name} 
                    />
                    <span className="badge product-badge">{product.discipline?.toUpperCase()}</span>
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-desc-short">{(product.description || '').slice(0, 80)}...</p>
                    <div className="product-specs-tiny">
                      {product.carbonPercentage && <span>Carbon: {product.carbonPercentage}%</span>}
                      {product.bowType && <span>Bow: {product.bowType}</span>}
                    </div>
                    <div className="product-price-action">
                      <span className="product-price">{product.currency || '€'}{product.price}</span>
                      <Link to={`/product/${product._id}`} className="btn-secondary btn-small">
                        VEW SPECS
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="center-actions">
            <Link to="/catalog" className="btn-primary">VIEW ALL POWER INSTRUMENTS</Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials - Pro Elite Athletes */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">FIELD TESTED BY PROS</span>
            <h2>Proven Under <span className="gradient-text">Extreme Force</span></h2>
            <p className="section-subtitle">Listen to players who have replaced standard sponsored gear with AMI custom layups.</p>
          </div>

          <div className="grid grid-3">
            <div className="testimonial card">
              <p className="testimonial-text">
                "The low-bow deflection on the AMI Carbon-95 changed my overhead game. Drag-flicks are cleaner, and the ball stays glued to the hook. No vibration at all."
              </p>
              <div className="testimonial-author">
                <img src="https://i.pravatar.cc/150?img=11" alt="Markus" className="avatar" />
                <div>
                  <strong>Markus V.</strong>
                  <span>EHL First Division Midfielder</span>
                </div>
              </div>
            </div>

            <div className="testimonial card">
              <p className="testimonial-text">
                "I was skeptical about carbon woven padel rackets, but the sweet spot on the AMI Padel Diamond is massive. The power transfer when executing a Vibora is unmatched."
              </p>
              <div className="testimonial-author">
                <img src="https://i.pravatar.cc/150?img=20" alt="Lucia" className="avatar" />
                <div>
                  <strong>Lucia G.</strong>
                  <span>WPT Ranked Contender</span>
                </div>
              </div>
            </div>

            <div className="testimonial card">
              <p className="testimonial-text">
                "Our entire university club ordered the customized sublimated kits. They took only 2 weeks to arrive, and the breathability is elite. Highly recommend the custom designer tool!"
              </p>
              <div className="testimonial-author">
                <img src="https://i.pravatar.cc/150?img=33" alt="Tariq" className="avatar" />
                <div>
                  <strong>Tariq K.</strong>
                  <span>Technical Director, City Hockey Club</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="container">
        <div className="cta-section">
          <h2>Ready to Forge Your Own <span className="gradient-text">Legacy</span>?</h2>
          <p>
            Whether you are ordering a singular top-performance racket or designing uniforms for an entire sporting organization, AMI delivers unmatched athletic supremacy.
          </p>
          <div className="hero-actions">
            <Link to="/customizer" className="btn-primary">START CUSTOM KIT DESIGN</Link>
            <Link to="/catalog" className="btn-secondary">BROWSE READY STOCKS</Link>
          </div>
        </div>
      </div>
    </div>
  );
}