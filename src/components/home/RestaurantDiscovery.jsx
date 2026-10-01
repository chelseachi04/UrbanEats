import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { fetchCuratedFeaturedRestaurants } from '../../services/showcaseService';
import { getRestaurantImage } from '../../data/imageAssets';
import { getRestaurantCoverUrl } from '../../utils/imageUtils';
import ImageWithFallback from '../common/ImageWithFallback';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function RestaurantDiscovery() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  useScrollAnimation([loading, restaurants.length]);

  useEffect(() => {
    fetchCuratedFeaturedRestaurants()
      .then(setRestaurants)
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section" id="restaurants">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-subtitle">Top Partners</div>
          <h2 className="section-title">Explore Featured Restaurants</h2>
          <p className="section-description">
            Discover top-rated local food spots in Abraka offering traditional meals, breakfast specials, and buka delicacies.
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
            <span>Loading restaurants…</span>
          </div>
        )}

        {/* Restaurant cards — strictly admin-curated featured restaurants */}
        {!loading && (
          <div className="grid grid-cols-3">
            {restaurants.map((restaurant, index) => {
              const categories = (restaurant.category || '').split(/[,&]/).map(c => c.trim());
              const coverImg = restaurant.custom_cover_image || getRestaurantCoverUrl(restaurant) || getRestaurantImage(restaurant.slug, restaurant.id);

              return (
                <div
                  key={restaurant.id}
                  className="restaurant-card animate-on-scroll"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="restaurant-img-wrapper">
                    <ImageWithFallback
                      src={coverImg || restaurant.cover_image}
                      alt={restaurant.name}
                      className="restaurant-img"
                    />
                    <span className="restaurant-status-tag badge badge-success">
                      {restaurant.status}
                    </span>
                  </div>

                  <div className="restaurant-content">
                    <div className="restaurant-header">
                      <h3 className="restaurant-name">{restaurant.name}</h3>
                    </div>

                    <div className="restaurant-category-text">
                      {categories.join(' • ')}
                    </div>

                    {restaurant.location && (
                      <div className="restaurant-location">
                        <MapPin size={15} />
                        <span>{restaurant.location}</span>
                      </div>
                    )}

                    <p className="restaurant-description">
                      {restaurant.description}
                    </p>

                    <div className="restaurant-card-action">
                      <button
                        className="btn btn-outline btn-full"
                        onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                        aria-label={`View restaurant details for ${restaurant.name}`}
                      >
                        View Restaurant
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
