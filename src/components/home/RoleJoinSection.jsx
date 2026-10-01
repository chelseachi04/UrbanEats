import React from 'react';
import { Store, Bike, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function RoleJoinSection() {
  const { openRegister } = useAuth();
  useScrollAnimation();

  return (
    <section className="section" id="join-partner">
      <div className="container">
        <div className="cta-banner animate-on-scroll">
          <div className="cta-grid">
            {/* Vendor CTA Box */}
            <div className="cta-box animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
              <div>
                <div style={{ display: 'inline-flex', padding: '0.65rem', background: 'rgba(255, 90, 31, 0.15)', color: 'var(--primary)', borderRadius: '12px', marginBottom: '1.25rem' }}>
                  <Store size={32} />
                </div>
                <h3>Grow Your Restaurant With UrbanEats</h3>
                <p>
                  Reach more customers in Abraka and grow your food business with UrbanEats.
                </p>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={() => openRegister('vendor')}
              >
                Become a Vendor
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Rider CTA Box */}
            <div className="cta-box animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
              <div>
                <div style={{ display: 'inline-flex', padding: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', borderRadius: '12px', marginBottom: '1.25rem' }}>
                  <Bike size={32} />
                </div>
                <h3>Deliver With UrbanEats</h3>
                <p>
                  Join the UrbanEats delivery network and help bring meals to customers across Abraka.
                </p>
              </div>

              <button
                className="btn btn-secondary btn-lg"
                style={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.2)' }}
                onClick={() => openRegister('rider')}
              >
                Become a Rider
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
