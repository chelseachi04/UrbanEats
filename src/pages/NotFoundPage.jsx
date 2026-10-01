import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="section" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <div className="container">
        <h1 style={{ fontSize: '5rem', color: 'var(--primary)', fontWeight: 800 }}>404</h1>
        <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem auto' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          Return to Home Page
        </Link>
      </div>
    </div>
  );
}
