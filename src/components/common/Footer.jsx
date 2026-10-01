import React from 'react';
import { Link } from 'react-router-dom';
import { logoImg } from '../../data/restaurantsData';
import deltaPalaceCover from '../../Delta Food Palace/Delta Food Palace.webp';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { openRegister } = useAuth();

  return (
    <footer
      className="footer"
      style={{
        backgroundImage: `url("${deltaPalaceCover}")`
      }}
    >
      {/* Dark Dimming Overlay */}
      <div className="footer-overlay"></div>

      <div className="container footer-content-container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="footer-brand-title">
              <img src={logoImg} alt="UrbanEats" style={{ height: '36px', width: 'auto' }} />
              <span>UrbanEats</span>
            </div>
            <p className="footer-brand-desc">
              Abraka's dedicated web-based food ordering and delivery platform. Connecting local restaurants, hungry customers, and swift riders.
            </p>
          </div>

          {/* Side-by-Side Two-Column Section: Platform (Left) + Partner Roles (Right) */}
          <div className="footer-nav-two-col">
            {/* Quick Links: Platform */}
            <div className="footer-col footer-col-platform">
              <h4 className="footer-title">Platform</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/" className="footer-link">Home</Link>
                </li>
                <li>
                  <Link to="/restaurants" className="footer-link">Explore Restaurants</Link>
                </li>
                <li>
                  <Link to="/food-health" className="footer-link">Food & Health</Link>
                </li>
                <li>
                  <Link to="/about" className="footer-link">About UrbanEats</Link>
                </li>
                <li>
                  <Link to="/faq" className="footer-link">FAQ &amp; Support</Link>
                </li>
              </ul>
            </div>

            {/* Join Roles: Partner Roles */}
            <div className="footer-col footer-col-roles">
              <h4 className="footer-title">Partner Roles</h4>
              <ul className="footer-links">
                <li>
                  <button type="button" className="footer-link footer-link-btn" onClick={() => openRegister('customer')}>
                    Customer Registration
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link footer-link-btn" onClick={() => openRegister('vendor')}>
                    Become a Vendor
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link footer-link-btn" onClick={() => openRegister('rider')}>
                    Become a Rider
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal / Coverage */}
          <div className="footer-col footer-col-legal">
            <h4 className="footer-title">Coverage & Legal</h4>
            <ul className="footer-links">
              <li className="footer-link-static">Abraka (Site I, II, III)</li>
              <li className="footer-link-static">Campus Gate & Expressway</li>
              <li>
                <Link to="/terms" className="footer-link">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} UrbanEats Platform. All rights reserved.
          </div>
          <div>
            Production Architecture • Phase 1
          </div>
        </div>
      </div>
    </footer>
  );
}
