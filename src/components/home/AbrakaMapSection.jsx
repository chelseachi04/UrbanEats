import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight, X } from 'lucide-react';
import { fetchRestaurants } from '../../api/restaurantApi';
import { getRestaurantImage } from '../../data/imageAssets';
import { getRestaurantCoverUrl } from '../../utils/imageUtils';
import ImageWithFallback from '../common/ImageWithFallback';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

// Fixed Abraka map pin positions keyed by restaurant slug.
// These represent geographic location markers on the stylised map layout.
// Slugs are stable identifiers — they match the database slug field.
const MAP_MARKERS = [
  { slug: 'delta-food-palace',  label: 'Delta Food Palace',  area: 'Site II, Abraka',          top: '32%', left: '28%' },
  { slug: 'mayor-breakfast',    label: 'Mayor Breakfast',    area: 'Campus Gate, Abraka',       top: '48%', left: '64%' },
  { slug: 'royal-delta-buka',   label: 'Royal Delta Buka',   area: 'Main Market Rd, Abraka',    top: '72%', left: '42%' },
];

export default function AbrakaMapSection() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants]         = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  useScrollAnimation();

  useEffect(() => {
    fetchRestaurants()
      .then((data) => {
        setRestaurants(data);
        if (data.length > 0) setSelectedRestaurant(data[0]);
      })
      .catch(() => setRestaurants([]));
  }, []);

  return (
    <section className="section" id="map-section">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-subtitle">Abraka Coverage</div>
          <h2 className="section-title">Find Food Around Abraka</h2>
          <p className="section-description">
            Discover restaurants and food vendors around Abraka and explore where your next meal is coming from.
          </p>
        </div>

        <div className="abraka-map-container animate-on-scroll">
          {/* SVG Map Grid Background */}
          <svg className="map-svg-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M 100 200 Q 350 180 500 300 T 900 450" fill="none" stroke="rgba(255, 90, 31, 0.35)" strokeWidth="4" strokeDasharray="8 6" />
            <path d="M 300 100 L 300 500 M 650 150 L 650 550" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="3" />
            <text x="180" y="140" fill="rgba(255,255,255,0.4)" fontSize="16" fontWeight="bold">DELSU Site II</text>
            <text x="660" y="180" fill="rgba(255,255,255,0.4)" fontSize="16" fontWeight="bold">Campus Gate Zone</text>
            <text x="360" y="520" fill="rgba(255,255,255,0.4)" fontSize="16" fontWeight="bold">Main Market Road</text>
          </svg>

          {/* Map Pin Markers — resolve restaurant from API data by slug */}
          {MAP_MARKERS.map((marker) => {
            const restaurant = restaurants.find(r => r.slug === marker.slug);
            const isSelected = selectedRestaurant?.slug === marker.slug;

            return (
              <button
                key={marker.slug}
                type="button"
                className={`map-pin-btn ${isSelected ? 'selected' : ''}`}
                style={{ top: marker.top, left: marker.left }}
                onClick={() => restaurant && setSelectedRestaurant(restaurant)}
                aria-label={`Select ${marker.label} in ${marker.area}`}
              >
                <MapPin size={16} />
                <span>{marker.label}</span>
              </button>
            );
          })}

          {/* Info Card Popup — content from MySQL via PHP API */}
          {selectedRestaurant && (
            <div className="map-info-popup">
              <button
                type="button"
                onClick={() => setSelectedRestaurant(null)}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  color: 'var(--text-muted)',
                  padding: '0.25rem',
                  borderRadius: '50%'
                }}
                aria-label="Close popup"
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '70px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                  <ImageWithFallback
                    src={getRestaurantCoverUrl(selectedRestaurant) || getRestaurantImage(selectedRestaurant.slug, selectedRestaurant.id) || selectedRestaurant.cover_image}
                    alt={selectedRestaurant.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.2rem' }}>
                    {selectedRestaurant.status}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
                    {selectedRestaurant.name}
                  </h4>
                  {selectedRestaurant.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                      <Navigation size={13} style={{ color: 'var(--primary)' }} />
                      <span>{selectedRestaurant.location}</span>
                    </div>
                  )}

                  <button
                    className="btn btn-primary btn-sm btn-full"
                    onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
                  >
                    View Restaurant & Menu
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
