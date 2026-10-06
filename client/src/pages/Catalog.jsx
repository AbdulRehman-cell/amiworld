import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state initialized from search params or defaults
  const activeDiscipline = searchParams.get('discipline') || 'All';
  const activeBow = searchParams.get('bowType') || 'All';
  const activeCarbon = searchParams.get('carbon') || 'All';
  const searchQuery = searchParams.get('search') || '';

  // Options for premium sport filters
  const disciplines = ['All', 'Field Hockey', 'Padel', 'Gear & Accessories'];
  const bowTypes = ['All', 'Low Bow', 'Pro Bow', 'Mid Bow', 'Round', 'Teardrop', 'Diamond'];
  const carbonPercentages = ['All', '90%+', '70% - 90%', 'Under 70%'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/products');
        // Handle unexpected data structure safely
        const data = Array.isArray(response.data) ? response.data : (response.data?.products || []);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching catalog products:', err);
        setError(err.response?.data?.error || 'Failed to sync with the AMI Tactical Database. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update query parameters on filter click
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  // Filter products on client side defensively
  const filteredProducts = products.filter((product) => {
    // 1. Discipline Filter
    if (activeDiscipline !== 'All') {
      if (product.discipline?.toLowerCase() !== activeDiscipline.toLowerCase()) {
        return false;
      }
    }

    // 2. Bow/Shape Type Filter
    if (activeBow !== 'All') {
      if (product.bowType?.toLowerCase() !== activeBow.toLowerCase()) {
        return false;
      }
    }

    // 3. Carbon Percentage Filter
    if (activeCarbon !== 'All') {
      const carbon = Number(product.carbonPercentage) || 0;
      if (activeCarbon === '90%+') {
        if (carbon < 90) return false;
      } else if (activeCarbon === '70% - 90%') {
        if (carbon < 70 || carbon > 90) return false;
      } else if (activeCarbon === 'Under 70%') {
        if (carbon >= 70) return false;
      }
    }

    // 4. Search Bar Text
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name?.toLowerCase().includes(q);
      const matchDesc = product.description?.toLowerCase().includes(q);
      const matchSku = product.sku?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchSku) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <section className="section-head text-center animate-in" style={{ marginBottom: '3rem' }}>
        <span className="eyebrow" style={{ color: 'var(--primary)', letterSpacing: '2px', fontWeight: 'bold' }}>
          ENGINEERED COMBAT WEAPONS
        </span>
        <h1 style={{ fontSize: 'var(--step-4)', margin: '0.5rem 0' }}>
          THE AMI <span className="gradient-text">ARSENAL</span>
        </h1>
        <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)' }}>
          Ultra-high-grade carbon composites and hyper-balanced padel rackets built to maximize responsiveness, stiffness, and devastating velocity.
        </p>
      </section>

      {/* Control Panel: Search & Quick Reset */}
      <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by model, SKU, profile..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--text)',
              fontSize: '0.95rem'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredProducts.length}</strong> combat tools
          </span>
          {(activeDiscipline !== 'All' || activeBow !== 'All' || activeCarbon !== 'All' || searchQuery) && (
            <button
              onClick={clearAllFilters}
              className="btn-ghost"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '4px' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout: Left sidebar filters + Right product showcase */}
      <div className="grid grid-4" style={{ gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* SIDEBAR FILTERS */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem', backgroundColor: 'rgba(255,255,255,0.01)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
          
          {/* Discipline Selection */}
          <div>
            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--text)' }}>
              Discipline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {disciplines.map((discipline) => (
                <button
                  key={discipline}
                  onClick={() => handleFilterChange('discipline', discipline)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 0.8rem',
                    textAlign: 'left',
                    borderRadius: '6px',
                    backgroundColor: activeDiscipline === discipline ? 'var(--primary)' : 'transparent',
                    color: activeDiscipline === discipline ? 'var(--bg)' : 'var(--text)',
                    fontWeight: activeDiscipline === discipline ? 'bold' : 'normal',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <span>{discipline}</span>
                  {activeDiscipline === discipline && <span style={{ fontSize: '0.75rem' }}>●</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Bow / Shape Profiles */}
          <div>
            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--text)' }}>
              Bow & Mold Profile
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {bowTypes.map((bow) => (
                <button
                  key={bow}
                  onClick={() => handleFilterChange('bowType', bow)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 0.8rem',
                    textAlign: 'left',
                    borderRadius: '6px',
                    backgroundColor: activeBow === bow ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: activeBow === bow ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: activeBow === bow ? 'bold' : 'normal',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <span>{bow}</span>
                  {activeBow === bow && <span style={{ color: 'var(--primary)' }}>✔</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Carbon Fiber Compound */}
          <div>
            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--text)' }}>
              Carbon Rating
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {carbonPercentages.map((percent) => (
                <button
                  key={percent}
                  onClick={() => handleFilterChange('carbon', percent)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 0.8rem',
                    textAlign: 'left',
                    borderRadius: '6px',
                    backgroundColor: activeCarbon === percent ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: activeCarbon === percent ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: activeCarbon === percent ? 'bold' : 'normal',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <span>{percent}</span>
                  {activeCarbon === percent && <span style={{ color: 'var(--primary)' }}>✔</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Tactical Note banner */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>AMI COMPOSITE LABS</span>
            Our field hockey weaponry uses high-modulus Japanese carbon laid by hand at precise angles. Padel rackets utilize 3K/12K/18K aluminized carbon weaves.
          </div>
        </aside>

        {/* PRODUCTS GRID SHOWCASE */}
        <main style={{ gridColumn: 'span 3' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Retrieving laboratory specifications...</p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
              {error}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Tactical Matches Found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
                Your current specification matrix yielded no results. Try modifying your carbon percentage, bow selection, or clear some filter tags.
              </p>
              <button className="btn-primary" onClick={clearAllFilters}>
                Clear Filter Parameters
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-3" style={{ gap: '1.5rem' }}>
              {filteredProducts.map((product) => {
                const carbon = Number(product.carbonPercentage) || 0;
                const isPremiumCarbon = carbon >= 90;
                const imageSrc = product.images || `https://picsum.photos/seed/${product.sku || 'ami'}/600/600`;

                return (
                  <article
                    key={product._id || product.sku}
                    className="card animate-in"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'transform 0.2s ease, border-color 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Visual Badges */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: '2', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span className="badge" style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                        {product.discipline || 'Tactical Gear'}
                      </span>
                      {isPremiumCarbon && (
                        <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg)', fontWeight: 'bold' }}>
                          {carbon}% PREMIUM CARBON
                        </span>
                      )}
                    </div>

                    {/* Image Area */}
                    <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#090909', aspectRatio: '1/1' }}>
                      <img
                        src={imageSrc}
                        alt={product.name || 'AMI high performance product'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://picsum.photos/seed/placeholder/600/600';
                        }}
                      />
                    </div>

                    {/* Meta & Specification Details */}
                    <div style={{ padding: '1.25rem', flexGrow: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                            SKU: {product.sku || 'AMI-PRO-001'}
                          </span>
                          {product.bowType && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                              {product.bowType}
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text)' }}>
                          {product.name || 'AMI Carbon Prototype'}
                        </h3>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineClamp: '2', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.5rem', marginBottom: '1rem' }}>
                          {product.description || 'Premium military-grade sports gear optimized for high velocity impact and extreme precision.'}
                        </p>
                      </div>

                      <div>
                        {/* Material metrics */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                          <span>Carbon: <strong>{product.carbonPercentage || 0}%</strong></span>
                          <span>Weight: <strong>{product.weight || 'Standard'}</strong></span>
                        </div>

                        {/* Price & Primary Call-to-action */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text)' }}>
                            {product.currency || '€'}{product.price || '0.00'}
                          </span>
                          <Link
                            to={`/product/${product._id || 'mock-id'}`}
                            className="btn-primary"
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.85rem',
                              borderRadius: '6px',
                              textDecoration: 'none'
                            }}
                          >
                            VICTORY SPECS
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Trust & Technology Banner below Catalog */}
      <section className="cta-section animate-in" style={{ marginTop: '5rem', borderRadius: '16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: 'var(--bg)' }}>THE AMI ASSURANCE</span>
          <h2 style={{ color: 'var(--bg)', marginBottom: '1rem' }}>UNCOMPROMISING SPEED. ABSOLUTE WARRANTY.</h2>
          <p style={{ color: 'rgba(0,0,0,0.8)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            Every AMI stick and racket undergoes 150 hours of simulation Stress Testing inside high-frequency chambers. All items carry a comprehensive 12-month composite breakage warranty.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/customizer" className="btn-secondary" style={{ color: 'var(--text)', borderColor: 'var(--text)', backgroundColor: 'transparent' }}>
              CUSTOM TEAM KITS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}