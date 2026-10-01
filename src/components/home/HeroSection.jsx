import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';
import deltaPalaceImg from '../../Delta Food Palace/Delta Food Palace.webp';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function HeroSection() {
  const navigate = useNavigate();
  useScrollAnimation();

  return (
    <section className="hero">
      <div className="container hero-grid">
        {/* Left Column: Messaging & CTAs */}
        <div className="animate-on-scroll">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Abraka's #1 Food Ordering & Delivery Platform</span>
          </div>

          <h1 className="hero-title">
            Discover Great Food, Delivered <span>Fast to You</span>
          </h1>

          <p className="hero-description">
            UrbanEats connects you directly to Abraka's favorite local kitchens and buka spots. 
            Enjoy authentic Delta soups, freshly baked morning combos, and hot meals delivered right to your door.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/restaurants')}
            >
              Explore Restaurants
              <ArrowRight size={20} />
            </button>

            <a href="#how-it-works" className="btn btn-outline btn-lg">
              How It Works
            </a>
          </div>

          {/* Quick Metrics / Trust Indicators */}
          <div className="hero-trust-strip">
            <div className="hero-trust-item">
              <Clock size={18} className="hero-trust-icon" />
              <span>Fast Doorstep Delivery</span>
            </div>
            <div className="hero-trust-item">
              <ShieldCheck size={18} className="hero-trust-icon" />
              <span>Verified Local Kitchens</span>
            </div>
            <div className="hero-trust-item">
              <MapPin size={18} className="hero-trust-icon" />
              <span>Campus & Town Wide</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Card */}
        <div className="hero-image-wrapper animate-on-scroll" style={{ transitionDelay: '0.15s' }}>
          <div className="hero-main-card">
            <ImageWithFallback
              src={deltaPalaceImg}
              alt="Delta Food Palace Special Meal"
              className="hero-card-img"
            />
            
            <div className="hero-floating-badge">
              <div className="floating-icon">
                🌶️
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.95rem' }}>
                  Native Delta Delicacies
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Starch, Banga & Egusi Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
