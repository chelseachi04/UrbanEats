import React from 'react';

export default function PageSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        padding: '2rem 1rem',
      }}
    >
      <style>{`
        @keyframes pageSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: '42px',
          height: '42px',
          border: '3px solid rgba(249, 115, 22, 0.15)',
          borderTopColor: 'var(--primary, #F97316)',
          borderRadius: '50%',
          animation: 'pageSpin 0.75s linear infinite',
          marginBottom: '1rem',
        }}
      />
      <p style={{ color: 'var(--text-muted, #64748B)', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>
        Loading...
      </p>
    </div>
  );
}
