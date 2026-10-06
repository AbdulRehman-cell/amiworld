import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Customizer from './pages/Customizer';
import { Button, Badge, toast } from './components/ui';
import Admin from './pages/Admin.jsx'

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ami_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart data', e);
      }
    }
  }, []);

  // Sync cart to localStorage
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('ami_cart', JSON.stringify(newCart));
  };

  const addToCart = (product, quantity = 1, options = {}) => {
    const existingIndex = cart.findIndex(
      (item) => item.product._id === product._id && JSON.stringify(item.options) === JSON.stringify(options)
    );

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity, options });
    }
    
    saveCart(newCart);
    toast.success(`Acquired: ${product.name} added to your arsenal.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    saveCart(newCart);
    toast.info('Item removed from your tactical loadout.');
  };

  const updateQuantity = (index, change) => {
    const newCart = [...cart];
    const newQty = newCart[index].quantity + change;
    if (newQty <= 0) {
      newCart.splice(index, 1);
    } else {
      newCart[index].quantity = newQty;
    }
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    setIsCartOpen(false);
    toast.success('Tactical loadout cleared.');
  };

  // Close cart drawer on page change
  useEffect(() => {
    setIsCartOpen(false);
  }, [location]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = cart.length >= 3 ? subtotal * 0.15 : cart.length === 2 ? subtotal * 0.10 : 0;
  const finalTotal = subtotal - discountAmount;

  return (
    <div className="app-wrapper">
      {/* Dynamic Upper Bar */}
      <div className="promo-ticker">
        <span className="ticker-badge">CRITICAL BROADCAST</span>
        <span className="ticker-text">AUTOMATIC 15% BUNDLE DISCOUNT APPLIED TO THE FULL ARSENAL (ANY 3 ITEMS)</span>
      </div>

      {/* Main Header Nav */}
      <header className="main-header">
        <div className="header-container">
          <Link to="/" className="nav-logo">
            <span className="logo-text">AMI<span className="accent-dot">WORLD</span></span>
            <span className="logo-sub">VELOCITY WEAPONRY</span>
          </Link>

          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
              TACTICAL HUB
            </NavLink>
            <NavLink to="/catalog?discipline=hockey" className={({ isActive }) => isActive || (location.search.includes('hockey') && location.pathname === '/catalog') ? "nav-link active" : "nav-link"}>
              HOCKEY LAB
            </NavLink>
            <NavLink to="/catalog?discipline=padel" className={({ isActive }) => isActive || (location.search.includes('padel') && location.pathname === '/catalog') ? "nav-link active" : "nav-link"}>
              PADEL LAB
            </NavLink>
            <NavLink to="/catalog?discipline=gear" className={({ isActive }) => isActive || (location.search.includes('gear') && location.pathname === '/catalog') ? "nav-link active" : "nav-link"}>
              GEAR SYSTEMS
            </NavLink>
            <NavLink to="/customizer" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              KIT LAB
            </NavLink>
          </nav>

          <div className="header-actions">
            <Button 
              variant="ghost" 
              onClick={() => setIsCartOpen(!isCartOpen)}
              iconLeft={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              }
            >
              ARSENAL ({totalItems})
            </Button>
          </div>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer for Tactical Arsenal */}
      {isCartOpen && (
        <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>YOUR TACTICAL ARSENAL</h3>
              <button className="drawer-close-btn" onClick={() => setIsCartOpen(false)}>
                &times;
              </button>
            </div>

            <div className="drawer-content">
              {cart.length === 0 ? (
                <div className="empty-drawer">
                  <div className="empty-drawer-icon">⚠️</div>
                  <h4>TACTICAL LOADOUT EMPTY</h4>
                  <p>Your current arsenal is offline. Equip carbon weaponry and systems from the laboratories.</p>
                  <Link to="/catalog" className="btn-primary" onClick={() => setIsCartOpen(false)}>
                    <span>EQUIP YOUR GAME</span>
                  </Link>
                </div>
              ) : (
                <div className="drawer-items">
                  {cart.map((item, index) => (
                    <div className="drawer-item" key={index}>
                      <img 
                        src={item.product.images?.split(',')[0] || item.product.images || 'https://picsum.photos/seed/placeholder/200/200'} 
                        alt={item.product.name} 
                        className="drawer-item-img" 
                      />
                      <div className="drawer-item-details">
                        <div className="drawer-item-row">
                          <h4 className="drawer-item-title">{item.product.name}</h4>
                          <span className="drawer-item-price">£{item.product.price}</span>
                        </div>
                        <p className="drawer-item-meta">
                          {item.product.bowType && item.product.bowType !== 'N/A' ? `${item.product.bowType} | ` : ''}
                          {item.product.carbonPercentage ? `${item.product.carbonPercentage}% Carbon` : 'Composite Gear'}
                        </p>
                        {item.options && Object.keys(item.options).length > 0 && (
                          <div className="drawer-item-options">
                            {Object.entries(item.options).map(([key, val]) => (
                              <span key={key} className="badge badge-neutral">{key}: {val}</span>
                            ))}
                          </div>
                        )}
                        <div className="drawer-item-controls">
                          <div className="qty-selector">
                            <button onClick={() => updateQuantity(index, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(index, 1)}>+</button>
                          </div>
                          <button className="remove-btn" onClick={() => removeFromCart(index)}>
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="drawer-footer">
                <div className="pricing-summary">
                  <div className="summary-row">
                    <span>SUBTOTAL</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  {cart.length === 2 && (
                    <div className="summary-row discount">
                      <span>DUAL-COMPLEMENT DISCOUNT (10%)</span>
                      <span>-£{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {cart.length >= 3 && (
                    <div className="summary-row discount">
                      <span>FULL ARSENAL DISCOUNT (15%)</span>
                      <span>-£{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>ESTIMATED TOTAL</span>
                    <span>£{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="drawer-actions">
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      toast.success('Tactical deployment initialized! Mock order processed successfully.');
                      clearCart();
                    }}
                    style={{ width: '100%', marginBottom: '12px' }}
                  >
                    <span>SECURE THE WEAPONS</span>
                  </button>
                  <button className="btn-ghost" onClick={clearCart} style={{ width: '100%' }}>
                    CLEAR LOADOUT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Core Page Router */}
      <main className="main-content-area">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/catalog" element={<Catalog addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/customizer" element={<Customizer addToCart={addToCart} />} />
                <Route path="/admin" element={<Admin />} />
      </Routes>
      </main>

      {/* Kinetic Footer */}
      <footer className="footer animate-in">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <span className="footer-logo">AMI<span className="accent-dot">WORLD</span></span>
              <p className="footer-pitch">
                We engineer high-tensile carbon field hockey weaponry and biomechanically optimized paddle rackets for athletes who play at the absolute limit of velocity.
              </p>
              <div className="tech-badge">
                <span className="glow-dot"></span> ESTABLISHED 2026 | CALIBRATED PERFORMANCE
              </div>
            </div>

            <div className="footer-links-col">
              <h4>TACTICAL DIVISIONS</h4>
              <ul>
                <li><Link to="/catalog?discipline=hockey">Field Hockey Composites</Link></li>
                <li><Link to="/catalog?discipline=padel">Padel Orbit Series</Link></li>
                <li><Link to="/catalog?discipline=gear">Modular Tactical Gear</Link></li>
                <li><Link to="/customizer">Dynamic Kit Customizer</Link></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>SPECIFICATIONS</h4>
              <ul>
                <li><a href="#tech">Japanese Toray Carbon Fibre</a></li>
                <li><a href="#tech">Tri-Axial Weave Dynamics</a></li>
                <li><a href="#tech">Vibe-Cancel Polyurethane Gel</a></li>
                <li><a href="#tech">EVA Elastic-Foam Core 38g/dm³</a></li>
              </ul>
            </div>

            <div className="footer-newsletter-col">
              <h4>SECURE 15% INFILTRATION DISCOUNT</h4>
              <p>Receive extreme engineering updates, technical spec releases, and exclusive athlete priority drops.</p>
              <form onSubmit={(e) => { e.preventDefault(); toast.success('Tactical Access Granted. Check your inbox for the 15% discount code.'); e.target.reset(); }}>
                <input type="email" placeholder="ENTER ATHLETE EMAIL" required className="newsletter-input" />
                <button type="submit" className="btn-primary" style={{ marginTop: '12px', width: '100%' }}>
                  <span>ACQUIRE PRIORITY ACCESS</span>
                </button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} AMIWORLD INC. PRECISION IS ABSOLUTE. ALL RIGHTS RESERVED.</p>
            <div className="legal-links">
              <span>SECURITY PROTOCOLS</span>
              <span>TERMS OF DEPLOYMENT</span>
              <span>GEAR WARRANTY</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}