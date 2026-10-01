import React, { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import { getFoodItemImage, getRestaurantImage } from '../../data/imageAssets';

export default function ImageWithFallback({ src, alt, className, style, fallbackSrc }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasTriedFallback(false);
    setError(false);
  }, [src]);

  const handleError = () => {
    if (!hasTriedFallback) {
      setHasTriedFallback(true);
      const localAsset = fallbackSrc || getFoodItemImage(alt) || getRestaurantImage(alt);
      if (localAsset && localAsset !== currentSrc) {
        setCurrentSrc(localAsset);
        return;
      }
    }
    setError(true);
  };

  // Normalize image source path
  let finalSrc = currentSrc || fallbackSrc || getFoodItemImage(alt) || getRestaurantImage(alt);
  if (typeof finalSrc === 'string') {
    finalSrc = finalSrc.trim();
    if (finalSrc.startsWith('src/')) {
      finalSrc = '/' + finalSrc;
    }
  }

  if (error || !finalSrc) {
    return (
      <div
        className={`img-fallback-container ${className || ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F1F5F9',
          color: '#94A3B8',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 'inherit',
          boxSizing: 'border-box',
          ...style,
        }}
        title={alt || 'UrbanEats'}
      >
        <Utensils size={20} style={{ opacity: 0.6, flexShrink: 0 }} />
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={alt || 'UrbanEats'}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}
