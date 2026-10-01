import React, { useState, useEffect } from 'react';
import { logoImg } from '../../data/imageAssets';

export default function SplashScreen({ onFinish }) {
  const [fadingOut, setFadingOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Start fade-out animation after 1.4 seconds
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 1400);

    // Completely unmount after fade-out finishes (1.8s)
    const removeTimer = setTimeout(() => {
      setHidden(true);
      if (onFinish) onFinish();
    }, 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  if (hidden) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 0.4s ease-in-out',
        pointerEvents: fadingOut ? 'none' : 'auto',
      }}
    >
      <style>{`
        @keyframes splashPulse {
          0% { transform: scale(0.92); opacity: 0.7; }
          50% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes splashBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      {/* Center Box */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '360px',
          width: '100%',
          animation: 'splashPulse 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Logo Container */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '24px',
            backgroundColor: '#ffffff',
            padding: '12px',
            boxShadow: '0 20px 40px rgba(249, 115, 22, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <img
            src={logoImg}
            alt="UrbanEats Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            color: '#ffffff',
            fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
            fontWeight: 900,
            margin: '0 0 0.4rem 0',
            letterSpacing: '-0.03em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Urban<span style={{ color: 'var(--primary, #F97316)' }}>Eats</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            color: '#94A3B8',
            fontSize: 'clamp(0.85rem, 3vw, 1rem)',
            fontWeight: 600,
            margin: '0 0 2rem 0',
            letterSpacing: '0.02em',
          }}
        >
          One platform . Endless Favors.
        </p>

        {/* Progress Bar Container */}
        <div
          style={{
            width: '140px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--primary, #F97316)',
              borderRadius: '10px',
              animation: 'splashBar 1.3s ease-in-out forwards',
            }}
          />
        </div>
      </div>
    </div>
  );
}
