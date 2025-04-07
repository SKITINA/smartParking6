import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Apps Section */}
        <div className="footer-apps">
          <h3>OUR APPS</h3>
          <div className="app-buttons">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="/app-store.png" alt="Download on App Store" className="app-button" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="/google-play.png" alt="Get it on Google Play" className="app-button" />
            </a>
          </div>
        </div>

        {/* Main Grid */}
        <div className="footer-grid">
          {/* Book Parking */}
          <div className="footer-column">
            <h3>BOOK PARKING</h3>
            <ul className="footer-links">
              <li><Link to="/nyc">NYC PARKING</Link></li>
              <li><Link to="/chicago">CHICAGO PARKING</Link></li>
              <li><Link to="/washington">WASHINGTON DC PARKING</Link></li>
              <li><Link to="/boston">BOSTON PARKING</Link></li>
              <li><Link to="/denver">DENVER PARKING</Link></li>
              <li><Link to="/all-cities">ALL CITIES</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-column">
            <h3>CONTACT US</h3>
            <ul className="footer-links">
              <li><Link to="/about">ABOUT US</Link></li>
              <li><Link to="/support">SUPPORT</Link></li>
            </ul>
            <div className="social-media">
              <h3>FOLLOW ALONG</h3>
              <div className="social-icons">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="footer-column">
            <h3>RESOURCES</h3>
            <ul className="footer-links">
              <li><Link to="/sitemap">SITEMAP</Link></li>
              <li><Link to="/add-parking">ADD PARKING TO YOUR WEBSITE</Link></li>
              <li><Link to="/privacy">PRIVACY POLICY</Link></li>
              <li><Link to="/terms">TERMS OF SERVICE</Link></li>
              <li><Link to="/accessibility">ACCESSIBILITY STATEMENT</Link></li>
              <li><Link to="/covid">OUR COVID-19 EFFORTS</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="newsletter">
            <h3>SIGN UP FOR NEWS AND OFFERS</h3>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        {/* Logo */}
        <div className="footer-logo">
          <img src="/logo.png" alt="SP+ A Metropolis Company" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
