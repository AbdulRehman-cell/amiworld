import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Customization choices
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Recommendations state
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchProductAndRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        
        // Set default variables if any
        if (res.data.weight) {
          setSelectedWeight(res.data.weight);
        } else {
          setSelectedWeight('Standard');
        }

        if (res.data.discipline === 'Field Hockey') {
          setSelectedSize('36.5"');
        } else if (res.data.discipline === 'Padel') {
          setSelectedSize('Standard');
        } else {
          setSelectedSize('Medium');
        }

        // Fetch recommendations of same discipline
        const allRes = await axios.get('/api/products');
        const list = allRes.data || [];
        const matches = list
          .filter((item) => item._id !== id && item.discipline === res.data.discipline)
          .slice(0, 3);
        setRecommendedProducts(matches);

      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to deploy weapon telemetry. Product might not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRecommendations();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container" style={{ padding: '80px 20px', textAlign: 'center', background: '#0b0c10', color: '#66fcf1' }}>
        <div className="spinner" style={{
          border: '4px solid rgba(102, 252, 241, 0.1)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          borderLeftColor: '#66fcf1',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px auto'
        }}></div>
        <p style={{ letterSpacing: '2px', fontWeight: 'bold' }}>RETRIEVING SPECIFICATION MATRIX...</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container" style={{ padding: '80px 20px', textAlign: 'center', background: '#0b0c10', color: '#ffffff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #ff4d4d', padding: '40px', borderRadius: '4px', backgroundColor: '#141214' }}>
          <span style={{ fontSize: '3rem', color: '#ff4d4d', display: 'block', marginBottom: '20px' }}>⚠️</span>
          <h2 style={{ letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px' }}>CRITICAL ERROR</h2>
          <p style={{ color: '#c5c6c7', marginBottom: '25px' }}>{error || 'Requested inventory code is unrecognized.'}</p>
          <Link to="/catalog" className="btn-primary" style={{
            background: '#ff4d4d',
            color: '#fff',
            padding: '12px 24px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '1px',
            borderRadius: '4px'
          }}>
            RETURN TO ARMORY
          </Link>
        </div>
      </div>
    );
  }

  // Parse images string
  let imageList = [];
  if (product.images) {
    imageList = product.images.split(',').map(img => img.trim()).filter(Boolean);
  }
  if (imageList.length === 0) {
    imageList = ['https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=800'];
  }

  const handleAddToCart = () => {
    const options = {
      size: selectedSize,
      weight: selectedWeight,
      carbonPercentage: product.carbonPercentage || 0
    };
    if (typeof addToCart === 'function') {
      addToCart(product, quantity, options);
    } else {
      console.warn('addToCart function is missing from parent props context.');
    }
  };

  return (
    <div className="product-detail-view" style={{ background: '#0b0c10', color: '#ffffff', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav" style={{ background: '#1f2833', borderBottom: '1px solid #45f3ff33', padding: '15px 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          <Link to="/" style={{ color: '#c5c6c7', textDecoration: 'none' }}>AMI CORE</Link>
          <span style={{ color: '#45f3ff', margin: '0 10px' }}>/</span>
          <Link to="/catalog" style={{ color: '#c5c6c7', textDecoration: 'none' }}>ARMORY</Link>
          <span style={{ color: '#45f3ff', margin: '0 10px' }}>/</span>
          <span style={{ color: '#45f3ff', fontWeight: 'bold' }}>{product.name}</span>
        </div>
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '40px auto 0 auto', padding: '0 20px' }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr', lgGridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
          {/* Left Column: Tactical Visuals */}
          <div className="gallery-section">
            <div className="main-display-frame" style={{
              background: '#1f2833',
              border: '2px solid #45f3ff',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(69, 243, 255, 0.15)'
            }}>
              <img 
                src={imageList[activeImageIndex]} 
                alt={product.name} 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '15px' }} 
              />
              <span className="badge" style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#45f3ff',
                color: '#0b0c10',
                padding: '6px 12px',
                borderRadius: '2px',
                fontWeight: '900',
                fontSize: '0.75rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                boxShadow: '0 0 10px #45f3ff'
              }}>
                {product.discipline}
              </span>

              {product.carbonPercentage > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '15px',
                  background: 'rgba(11, 12, 16, 0.85)',
                  borderLeft: '4px solid #45f3ff',
                  padding: '8px 12px',
                  fontSize: '0.75rem'
                }}>
                  <strong style={{ color: '#45f3ff', display: 'block' }}>COMPOSITE MAKEUP</strong>
                  <span>{product.carbonPercentage}% PREMIUM CARBON MATRIX</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {imageList.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
                {imageList.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    style={{
                      flex: '0 0 80px',
                      height: '80px',
                      border: activeImageIndex === index ? '2px solid #45f3ff' : '2px solid #1f2833',
                      background: '#1f2833',
                      padding: '5px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <img src={imgUrl} alt={`${product.name} view ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Tech Attributes Quick Showcase */}
            <div style={{ marginTop: '30px', background: '#12161d', borderRadius: '6px', border: '1px solid #1f2833', padding: '20px' }}>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #1f2833', paddingBottom: '10px', color: '#45f3ff', fontSize: '0.9rem', marginTop: 0 }}>
                TACTICAL ENGINEERING ATTRIBUTES
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginTop: '15px' }}>
                <div style={{ background: '#1f2833', padding: '12px', borderRadius: '4px' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#c5c6c7', textTransform: 'uppercase' }}>BOW GEOMETRY</span>
                  <span style={{ display: 'block', fontSize: '1rem', fontWeight: 'bold', color: '#ffffff' }}>{product.bowType || 'Not Applicable'}</span>
                </div>
                <div style={{ background: '#1f2833', padding: '12px', borderRadius: '4px' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#c5c6c7', textTransform: 'uppercase' }}>TARGET DISCIPLINE</span>
                  <span style={{ display: 'block', fontSize: '1rem', fontWeight: 'bold', color: '#ffffff' }}>{product.discipline}</span>
                </div>
                <div style={{ background: '#1f2833', padding: '12px', borderRadius: '4px' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#c5c6c7', textTransform: 'uppercase' }}>WEIGHT RATING</span>
                  <span style={{ display: 'block', fontSize: '1rem', fontWeight: 'bold', color: '#ffffff' }}>{product.weight || 'Standard'}</span>
                </div>
                <div style={{ background: '#1f2833', padding: '12px', borderRadius: '4px' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#c5c6c7', textTransform: 'uppercase' }}>SKU IDENTIFIER</span>
                  <span style={{ display: 'block', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 'bold', color: '#45f3ff' }}>{product.sku || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing & Arming Console */}
          <div className="product-details-console" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ color: '#45f3ff', letterSpacing: '2px', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {product.discipline} SPECIFICATION
                  </span>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: '800', textTransform: 'uppercase', margin: '5px 0 15px 0', letterSpacing: '-1px', lineHeight: '1.1' }}>
                    {product.name}
                  </h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#c5c6c7', textTransform: 'uppercase', letterSpacing: '1px' }}>MSRP CODE</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: '900', color: '#45f3ff' }}>
                    {product.currency || '€'}{product.price?.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1f2833', borderBottom: '1px solid #1f2833', padding: '20px 0', margin: '15px 0' }}>
                <p style={{ color: '#c5c6c7', lineHeight: '1.6', fontSize: '1.05rem', margin: 0 }}>
                  {product.description || 'AMI High-performance design forged with advanced materials. Engineered to maximize velocity, ball tactile control, and structural dampening during high impact tournament scenarios.'}
                </p>
              </div>

              {/* Dynamic Tech Breakdown Tabs */}
              <div className="tab-interface" style={{ margin: '25px 0' }}>
                <div style={{ display: 'flex', borderBottom: '2px solid #1f2833' }}>
                  <button 
                    onClick={() => setActiveTab('specs')}
                    style={{
                      flex: 1,
                      padding: '12px 15px',
                      background: activeTab === 'specs' ? '#1f2833' : 'transparent',
                      border: 'none',
                      color: activeTab === 'specs' ? '#45f3ff' : '#c5c6c7',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      borderBottom: activeTab === 'specs' ? '2px solid #45f3ff' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    MATERIALS & SPECIFICATION
                  </button>
                  <button 
                    onClick={() => setActiveTab('tech')}
                    style={{
                      flex: 1,
                      padding: '12px 15px',
                      background: activeTab === 'tech' ? '#1f2833' : 'transparent',
                      border: 'none',
                      color: activeTab === 'tech' ? '#45f3ff' : '#c5c6c7',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      borderBottom: activeTab === 'tech' ? '2px solid #45f3ff' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    AMI ENGINEERING ADVANTAGE
                  </button>
                </div>

                <div className="tab-content" style={{ padding: '20px', background: '#12161d', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                  {activeTab === 'specs' ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #1f2833' }}>
                          <td style={{ padding: '8px 0', color: '#c5c6c7', fontWeight: 'bold' }}>CARBON COMPOSITION</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', color: '#45f3ff' }}>{product.carbonPercentage || 0}% Premium Weave</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #1f2833' }}>
                          <td style={{ padding: '8px 0', color: '#c5c6c7', fontWeight: 'bold' }}>PROFILE / BOW</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', color: '#ffffff' }}>{product.bowType || 'Dynamic Standard'}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #1f2833' }}>
                          <td style={{ padding: '8px 0', color: '#c5c6c7', fontWeight: 'bold' }}>WEIGHT SPECIFICATION</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', color: '#ffffff' }}>{product.weight || '530g - 550g Light'}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 0', color: '#c5c6c7', fontWeight: 'bold' }}>TACTICAL USE CASE</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', color: '#45f3ff', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold' }}>Elite Competition Preferred</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#c5c6c7' }}>
                      <p style={{ margin: '0 0 10px 0' }}>
                        <strong style={{ color: '#ffffff' }}>💥 AMI VORTEX CORE:</strong> Airshock-dispersal chamber inside the core neutralizes back-shock during high impact impacts, maintaining ultra high stiffness.
                      </p>
                      <p style={{ margin: '0 0 10px 0' }}>
                        <strong style={{ color: '#ffffff' }}>🌀 REINFORCED STRIKE EDGE:</strong> Double braided Kevlar wrapped along high-wear impact borders protects carbon fibers against high frictional deterioration.
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong style={{ color: '#ffffff' }}>🛡️ HYBRID SURFACING:</strong> Matte textured touch zone optimizes instantaneous micro-friction on field hockey turf and padel courts alike.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Configurator Box (Interactive Mock Customization) */}
              <div className="arming-options" style={{ background: '#12161d', border: '1px solid #1f2833', borderRadius: '6px', padding: '20px', marginBottom: '25px' }}>
                <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', marginTop: 0, marginBottom: '15px', color: '#ffffff', fontSize: '0.85rem' }}>
                  CONFIGURE WEAPON SYSTEM
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  {/* Size Config */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#c5c6c7', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {product.discipline === 'Padel' ? 'GRIP SIZE' : 'SYSTEM LENGTH'}
                    </label>
                    <select 
                      value={selectedSize} 
                      onChange={(e) => setSelectedSize(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#1f2833',
                        color: '#ffffff',
                        border: '1px solid #45f3ff33',
                        padding: '10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {product.discipline === 'Field Hockey' ? (
                        <>
                          <option value="36.5">36.5" Standard Optimal</option>
                          <option value="37.5">37.5" Tall Reach</option>
                        </>
                      ) : product.discipline === 'Padel' ? (
                        <>
                          <option value="Standard">Standard Ergonomic</option>
                          <option value="Overgrip Max">Overgrip Max Comfort</option>
                        </>
                      ) : (
                        <>
                          <option value="Medium">Medium Standard</option>
                          <option value="Large">Large Pack</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Weight Config */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#c5c6c7', textTransform: 'uppercase', marginBottom: '6px' }}>
                      DYNAMIC WEIGHT
                    </label>
                    <select 
                      value={selectedWeight} 
                      onChange={(e) => setSelectedWeight(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#1f2833',
                        color: '#ffffff',
                        border: '1px solid #45f3ff33',
                        padding: '10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value={product.weight || 'Standard'}>{product.weight || 'Standard Velocity'}</option>
                      <option value="Featherlight">Tactical Featherlight (-20g)</option>
                      <option value="Ultra-Heft">Ultra-Heft Impact (+20g)</option>
                    </select>
                  </div>
                </div>

                {/* Quantity Block */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '120px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#c5c6c7', textTransform: 'uppercase', marginBottom: '6px' }}>
                      DEPLOY QTY
                    </label>
                    <div style={{ display: 'flex', border: '1px solid #1f2833', borderRadius: '4px', background: '#1f2833', overflow: 'hidden' }}>
                      <button 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        style={{ border: 'none', background: 'transparent', color: '#ffffff', width: '35px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        min="1" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          color: '#ffffff',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                      />
                      <button 
                        onClick={() => setQuantity(prev => prev + 1)}
                        style={{ border: 'none', background: 'transparent', color: '#ffffff', width: '35px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ flex: 1, paddingTop: '18px' }}>
                    <button 
                      onClick={handleAddToCart}
                      className="btn-primary" 
                      style={{
                        width: '100%',
                        background: 'linear-gradient(90deg, #45f3ff 0%, #1f2833 100%)',
                        color: '#0b0c10',
                        border: 'none',
                        padding: '14px 20px',
                        borderRadius: '4px',
                        fontWeight: '900',
                        fontSize: '1rem',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(69, 243, 255, 0.3)',
                        transition: 'transform 0.1s'
                      }}
                    >
                      ADD TO TACTICAL LOADOUT
                    </button>
                  </div>
                </div>

                {/* Team custom hint */}
                <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#45f3ff' }}>
                  <span>📢</span>
                  <span>Need team branding, custom numbers, or customized graphics? Try our <Link to="/customizer" style={{ color: '#ffffff', textDecoration: 'underline', fontWeight: 'bold' }}>Active Customizer</Link>.</span>
                </div>
              </div>
            </div>

            {/* Quick Tactical Policy Promos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', borderTop: '1px solid #1f2833', paddingTop: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#45f3ff', fontSize: '1.2rem' }}>⚡</span>
                <div>
                  <h5 style={{ margin: '0 0 3px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EXPRESS ARMORY DELIVERY</h5>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#c5c6c7' }}>Shipped from central reserves within 24 operational hours.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#45f3ff', fontSize: '1.2rem' }}>🛡️</span>
                <div>
                  <h5 style={{ margin: '0 0 3px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2-YEAR INTEGRITY WARRANTY</h5>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#c5c6c7' }}>Full replacement guarantee against structural composite cracks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Recommendations Section */}
        {recommendedProducts.length > 0 && (
          <section style={{ marginTop: '70px', borderTop: '2px solid #1f2833', paddingTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
              <div>
                <span style={{ color: '#45f3ff', letterSpacing: '2px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>SIMILAR GEAR IN THE ARMORY</span>
                <h3 style={{ fontSize: '1.8rem', margin: '5px 0 0 0', textTransform: 'uppercase', fontWeight: '800' }}>COMPLEMENTARY ARSENAL</h3>
              </div>
              <Link to="/catalog" style={{ color: '#45f3ff', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'none', borderBottom: '1px solid #45f3ff' }}>
                BROWSE FULL CATALOG
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {recommendedProducts.map((rec) => {
                const recImages = rec.images ? rec.images.split(',') : [];
                const recMainImg = recImages[0] || 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=800';

                return (
                  <div 
                    key={rec._id} 
                    style={{
                      background: '#12161d',
                      border: '1px solid #1f2833',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'between',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <div style={{ background: '#1f2833', padding: '15px', position: 'relative', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={recMainImg} alt={rec.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(11, 12, 16, 0.85)', color: '#45f3ff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '2px', textTransform: 'uppercase', border: '1px solid #45f3ff33' }}>
                        {rec.discipline}
                      </span>
                    </div>

                    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', textTransform: 'uppercase', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {rec.name}
                        </h4>
                        <p style={{ margin: '0 0 15px 0', fontSize: '0.75rem', color: '#c5c6c7', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '32px' }}>
                          {rec.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1f2833', paddingTop: '12px' }}>
                        <span style={{ fontWeight: '900', color: '#45f3ff' }}>
                          {rec.currency || '€'}{rec.price?.toFixed(2)}
                        </span>
                        <Link 
                          to={`/product/${rec._id}`}
                          style={{
                            background: '#1f2833',
                            border: '1px solid #45f3ff',
                            color: '#45f3ff',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            borderRadius: '3px',
                            transition: 'all 0.2s'
                          }}
                        >
                          VIEW SPEC
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}