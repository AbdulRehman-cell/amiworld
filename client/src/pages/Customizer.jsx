import React, { useState } from 'react';
import axios from 'axios';

export default function Customizer() {
  const [discipline, setDiscipline] = useState('hockey'); // 'hockey' | 'padel'
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Configuration States
  const [baseColor, setBaseColor] = useState('#0d0d11');
  const [accentColor, setAccentColor] = useState('#00ffcc');
  const [secondaryColor, setSecondaryColor] = useState('#ff0055');
  const [carbonLevel, setCarbonLevel] = useState(90); // Slider 50 - 100
  const [bowShape, setBowShape] = useState('Low Bow (24mm)'); // for hockey
  const [padelShape, setPadelShape] = useState('Diamond (Power)'); // for padel
  const [surfaceTexture, setSurfaceTexture] = useState('Sandpaper Grit'); // 3D Hex, Sandpaper, Glossy
  const [customText, setCustomText] = useState('AMI PRO-ATHLETE');
  const [teamName, setTeamName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Preset Palettes
  const presets = [
    { name: 'Quantum Core', base: '#0d0d11', accent: '#00ffcc', secondary: '#ff0055' },
    { name: 'Aurora Stealth', base: '#151c24', accent: '#3b82f6', secondary: '#10b981' },
    { name: 'Carbon Magma', base: '#1a1110', accent: '#f97316', secondary: '#ef4444' },
    { name: 'Mono Elite', base: '#000000', accent: '#ffffff', secondary: '#888888' },
  ];

  const handleApplyPreset = (preset) => {
    setBaseColor(preset.base);
    setAccentColor(preset.accent);
    setSecondaryColor(preset.secondary);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!contactEmail) {
      setError('A valid operational email is required to dispatch the blueprints.');
      return;
    }

    setSubmitting(true);
    setError(null);

    // Prepare custom request package
    const designData = {
      discipline,
      baseColor,
      accentColor,
      secondaryColor,
      carbonLevel,
      profileAttribute: discipline === 'hockey' ? bowShape : padelShape,
      surfaceTexture,
      customText,
      teamName,
      contactEmail,
      notes
    };

    try {
      // Send blueprint simulation to an endpoint or mock standard client-submits (using customizer submission API or simulated timeout)
      // Since we strictly enforce only GET calls on normal public endpoints without server persistence,
      // or standard safe simulator submissions, we will simulate a robust tactical dispatch.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err) {
      setError('Communication relay failure. Please verify your grid connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError(null);
    setCustomText('AMI PRO-ATHLETE');
    setTeamName('');
    setContactEmail('');
    setNotes('');
  };

  return (
    <div className="container animate-in" style={{ padding: '40px 0' }}>
      
      {/* Header Section */}
      <section className="section-head" style={{ marginBottom: '40px' }}>
        <span className="eyebrow">AMI LABORATORY</span>
        <h1>TACTICAL <span className="gradient-text">CUSTOMIZER</span></h1>
        <p className="hero-subtitle">
          Configure high-performance gear down to the exact millimeter. Specify your carbon matrix, profile shape, and cosmetic colors. Our engineers build it. You dominate with it.
        </p>
      </section>

      {/* Discipline Toggle */}
      <div className="filter-bar" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '15px' }}>
        <button 
          className={`btn-secondary ${discipline === 'hockey' ? 'active' : ''}`} 
          onClick={() => { setDiscipline('hockey'); setSurfaceTexture('Carbon Weave'); }}
          style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          ⚔️ Field Hockey Stick
        </button>
        <button 
          className={`btn-secondary ${discipline === 'padel' ? 'active' : ''}`} 
          onClick={() => { setDiscipline('padel'); setSurfaceTexture('Sandpaper Grit'); }}
          style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          🎾 Padel Racket
        </button>
      </div>

      {submitted ? (
        <div className="alert alert-success" style={{ padding: '40px', borderRadius: '12px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ color: 'var(--success)' }}>BLUEPRINTS TRANSMITTED SUCCESSFULLY</h2>
          <p style={{ margin: '15px 0 25px 0', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Your custom specifications have been routed to the AMI prototyping hangar. Our composite engineers will review your configuration and contact you at <strong style={{ color: 'var(--text)' }}>{contactEmail}</strong> within 24 hours with rendering files and a physical construction quote.
          </p>
          <button className="btn-primary" onClick={resetForm}>
            Configure Another Archetype
          </button>
        </div>
      ) : (
        <div className="grid grid-2" style={{ gap: '30px', alignItems: 'stretch' }}>
          
          {/* Visual Simulation Column */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--surface-dark)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', minHeight: '550px' }}>
            
            {/* Hologram style grid lines */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
              <span className="badge" style={{ background: 'var(--accent)', color: '#000' }}>SIMULATION LIVE</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>MODEL ID: {discipline === 'hockey' ? 'AMI-HKY-PRO' : 'AMI-PDL-RAW'}</span>
            </div>

            {/* Virtual Product Renderer Mockup */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '1', position: 'relative', zIndex: 1, padding: '20px 0' }}>
              
              {discipline === 'hockey' ? (
                /* HOCKEY STICK RENDERER */
                <div style={{ width: '120px', height: '320px', position: 'relative', transition: 'all 0.3s ease' }}>
                  {/* Shaft */}
                  <div style={{
                    width: '18px',
                    height: '240px',
                    background: `linear-gradient(135deg, ${baseColor} 30%, #2a2a35 100%)`,
                    margin: '0 auto',
                    borderRadius: '4px 4px 0 0',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                    position: 'relative',
                    borderLeft: `3px solid ${accentColor}`
                  }}>
                    {/* Inner Accent Line */}
                    <div style={{ position: 'absolute', top: '10px', left: '4px', width: '2px', height: '180px', backgroundColor: secondaryColor }} />
                    {/* Custom Text Print */}
                    <div style={{
                      position: 'absolute',
                      top: '40px',
                      left: '1px',
                      transform: 'rotate(90deg)',
                      transformOrigin: 'left top',
                      color: '#ffffff',
                      fontSize: '6.5px',
                      fontWeight: '900',
                      letterSpacing: '2px',
                      whiteSpace: 'nowrap',
                      opacity: 0.9,
                      fontFamily: 'monospace'
                    }}>
                      {customText || 'AMI HIGH-PERFORMANCE'}
                    </div>
                  </div>
                  {/* Head Curve */}
                  <div style={{
                    width: '60px',
                    height: '45px',
                    background: `linear-gradient(135deg, ${baseColor} 40%, ${accentColor} 100%)`,
                    borderRadius: '0 0 25px 8px',
                    marginLeft: '42px',
                    marginTop: '-5px',
                    position: 'relative',
                    boxShadow: '5px 5px 15px rgba(0,0,0,0.4)',
                    borderBottom: `4px solid ${secondaryColor}`
                  }}>
                    {/* Carbon Weave Mock Indicator */}
                    <div style={{
                      position: 'absolute',
                      bottom: '5px',
                      left: '8px',
                      fontSize: '8px',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontFamily: 'monospace'
                    }}>
                      {carbonLevel}% C
                    </div>
                  </div>
                </div>
              ) : (
                /* PADEL RACKET RENDERER */
                <div style={{ width: '180px', height: '320px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Head Frame */}
                  <div style={{
                    width: '150px',
                    height: '180px',
                    borderRadius: padelShape.includes('Diamond') ? '30px 30px 70px 70px' : '90px',
                    background: `linear-gradient(135deg, ${baseColor} 30%, #1e1e24 100%)`,
                    border: `6px solid ${accentColor}`,
                    boxShadow: '0 15px 30px rgba(0,0,0,0.6)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {/* Inner Core Accent */}
                    <div style={{
                      width: '110px',
                      height: '140px',
                      borderRadius: padelShape.includes('Diamond') ? '20px 20px 50px 50px' : '75px',
                      border: `2px dashed ${secondaryColor}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {/* Hole Patterns */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 8px)', gap: '8px', opacity: 0.5 }}>
                        {Array.from({ length: 15 }).map((_, i) => (
                          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000' }} />
                        ))}
                      </div>
                      
                      {/* Custom Text Badge */}
                      <span style={{
                        position: 'absolute',
                        bottom: '20px',
                        fontSize: '8px',
                        background: 'rgba(0,0,0,0.8)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        color: '#fff',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        border: `1px solid ${accentColor}`
                      }}>
                        {customText || 'AMI PADEL'}
                      </span>
                    </div>
                  </div>

                  {/* Handle Bridge */}
                  <div style={{
                    width: '30px',
                    height: '25px',
                    background: secondaryColor,
                    marginTop: '-2px',
                    clipPath: 'polygon(0 0, 100% 0, 70% 100%, 30% 100%)',
                    zIndex: 2
                  }} />

                  {/* Grip Handle */}
                  <div style={{
                    width: '24px',
                    height: '100px',
                    background: 'linear-gradient(90deg, #111 0%, #2a2a2a 50%, #111 100%)',
                    borderBottom: `6px solid ${accentColor}`,
                    borderRadius: '0 0 6px 6px',
                    boxShadow: '0 8px 15px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ transform: 'rotate(90deg)', fontSize: '7px', color: '#666', fontFamily: 'monospace' }}>GRIP-X</span>
                  </div>
                </div>
              )}

              {/* Dynamic specs readout underneath */}
              <div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text)' }}>
                  {discipline === 'hockey' ? 'AMI CARBON-X STICK' : 'AMI TITAN-PADEL RACKET'}
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                  <span className="badge" style={{ borderColor: baseColor }}>BASE: {baseColor}</span>
                  <span className="badge" style={{ borderColor: accentColor }}>ACCENT: {accentColor}</span>
                  <span className="badge">{carbonLevel}% PREMIUM CARBON</span>
                </div>
              </div>
            </div>

            {/* Presets Row */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px', zIndex: 1 }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Engineered Presets:
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn-ghost"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleApplyPreset(preset)}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: preset.accent }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration Form Column */}
          <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              🔬 Tactical Specifications
            </h3>

            <form onSubmit={handleSubmitRequest}>
              {/* Custom Text/Name Engraving */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Laser Engraving Text (Max 18 chars)
                </label>
                <input
                  type="text"
                  maxLength={18}
                  placeholder="e.g. AMI PRO-ATHLETE"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', color: '#fff', textTransform: 'uppercase' }}
                />
              </div>

              {/* Color Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Base
                  </label>
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    style={{ width: '100%', height: '40px', padding: '2px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Accent
                  </label>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: '100%', height: '40px', padding: '2px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Secondary
                  </label>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    style={{ width: '100%', height: '40px', padding: '2px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Carbon Slider */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Carbon Matrix Density
                  </label>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{carbonLevel}% Carbon</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={carbonLevel}
                  onChange={(e) => setCarbonLevel(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>50% (Flexible control)</span>
                  <span>100% (Maximum stiffness / speed)</span>
                </div>
              </div>

              {/* Physical Profile Shape */}
              <div style={{ marginBottom: '20px' }}>
                {discipline === 'hockey' ? (
                  <>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Bow Profile Shape
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {['Low Bow (24mm)', 'Pro Bow (24mm)', 'Ultra Low Bow (Dragflick)', 'Mid Bow (Standard)'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`btn-ghost ${bowShape === opt ? 'active' : ''}`}
                          style={{ padding: '8px', fontSize: '0.8rem', textAlign: 'left' }}
                          onClick={() => setBowShape(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Frame Shape Geometry
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {['Diamond (Power)', 'Round (Control)', 'Teardrop (Hybrid/Balance)'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`btn-ghost ${padelShape === opt ? 'active' : ''}`}
                          style={{ padding: '8px', fontSize: '0.8rem', textAlign: 'left' }}
                          onClick={() => setPadelShape(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Surface Treatment */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Composite Surface Texture
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Glossy Armor', 'Sandpaper Grit', '3D Hex Micro-Rib'].map((texture) => (
                    <button
                      key={texture}
                      type="button"
                      className={`btn-ghost ${surfaceTexture === texture ? 'active' : ''}`}
                      style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
                      onClick={() => setSurfaceTexture(texture)}
                    >
                      {texture}
                    </button>
                  ))}
                </div>
              </div>

              <hr style={{ borderColor: 'var(--border)', margin: '25px 0' }} />

              {/* Submitter Contact Section */}
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '15px' }}>
                🚀 Request Production Prototyping
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
                    Team / Club Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Barcelona HC"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
                    Operational Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="captain@yourclub.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
                  Special Prototyping Directions or Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Need specific grip weight, custom decals, or have strict league regulation guidelines?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', color: '#fff', resize: 'vertical' }}
                />
              </div>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: '15px' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
              >
                {submitting ? (
                  <>
                    <span className="spinner" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    TRANSMITTING BLUEPRINT TO HANGAR...
                  </>
                ) : (
                  'SUBMIT CUSTOM BLUEPRINT'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Engineering specifications block */}
      <section className="section" style={{ marginTop: '60px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>AMI <span className="gradient-text">COMPOSITE</span> MANUFACTURING PROCESS</h2>
        <div className="grid grid-3" style={{ gap: '20px' }}>
          <div className="card" style={{ background: 'var(--surface)' }}>
            <div className="step-num" style={{ color: 'var(--accent)', fontSize: '2rem', fontWeight: '900', marginBottom: '10px' }}>01</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Japanese Toray Carbon Matrix</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              We lay down state-of-the-art Japanese carbon fiber prepreg layers in varying directions (0°, 45°, 90°) to guarantee unparalleled stiffness and energy transfer during impact.
            </p>
          </div>
          <div className="card" style={{ background: 'var(--surface)' }}>
            <div className="step-num" style={{ color: 'var(--accent)', fontSize: '2rem', fontWeight: '900', marginBottom: '10px' }}>02</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Vibration Control System (VCS)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Integrated silicone-based channels in the core disperse shockwaves upon stick-to-ball or ball-to-paddle contact, preventing kinetic fatigue to the athlete’s hands and forearms.
            </p>
          </div>
          <div className="card" style={{ background: 'var(--surface)' }}>
            <div className="step-num" style={{ color: 'var(--accent)', fontSize: '2rem', fontWeight: '900', marginBottom: '10px' }}>03</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Precision CNC Milling</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Each paddle and stick mold is carved from a solid block of aircraft-grade aluminum, holding tolerances to under 5 microns. This ensures consistency across entire club orders.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}