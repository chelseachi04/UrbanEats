import React from 'react';
import { Shield, Truck, Utensils } from 'lucide-react';
import { logoImg } from '../data/restaurantsData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SubPageHeader from '../components/common/SubPageHeader';

export default function AboutPage() {
  useScrollAnimation();

  return (
    <div style={{ marginTop: 0, paddingTop: 0 }}>
      {/* Sub-page header */}
      <SubPageHeader title="About UrbanEats" />

      <div className="section page-header-tight sub-page-content">
        <div className="container">
          <div className="section-header animate-on-scroll sub-page-desktop-header">
            <div className="section-subtitle">Our Mission</div>
            <h1 className="section-title">About UrbanEats</h1>
            <p className="section-description">
              UrbanEats is built specifically to transform how food ordering and delivery operates across Abraka, connecting restaurants, hungry customers, and local riders.
            </p>
          </div>

        <div className="grid grid-cols-2 animate-on-scroll" style={{ alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Bringing Abraka's Best Flavors to Your Doorstep</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Whether you are a student craving native Delta Banga soup between lectures, or a working professional needing a fast breakfast, UrbanEats delivers local quality food reliably.
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              We work hand-in-hand with top local food businesses—from established restaurants like Delta Food Palace to bustling morning spots like Mayor Breakfast and native bukas like Royal Delta Buka.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={logoImg} alt="UrbanEats Logo" style={{ maxHeight: '280px', objectFit: 'contain' }} />
          </div>
        </div>

        <div className="grid grid-cols-3">
          <div className="process-card animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="process-icon"><Utensils size={28} /></div>
            <h3 className="process-title">Authentic Food</h3>
            <p className="process-desc">Prepared fresh by verified local restaurants with real ingredients.</p>
          </div>
          <div className="process-card animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="process-icon"><Truck size={28} /></div>
            <h3 className="process-title">Swift Delivery</h3>
            <p className="process-desc">Delivered straight to campus gates, hostels, and residential quarters.</p>
          </div>
          <div className="process-card animate-on-scroll" style={{ transitionDelay: '0.3s' }}>
            <div className="process-icon"><Shield size={28} /></div>
            <h3 className="process-title">Empowering Local Businesses</h3>
            <p className="process-desc">Helping local vendors grow their customer reach and scale revenue.</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
