import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="nav-container">
        <Link to="/" className="logo">
          Smart Parking
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link to="/map" className="text-gray-600 hover:text-primary">
                Carte
              </Link>
            </li>
            <li>
              <Link to="/plate-detection" className="text-gray-600 hover:text-primary">
                Détection
              </Link>
            </li>
            <li>
              <Link to="/booking" className="text-gray-600 hover:text-primary">
                Réservation
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex gap-4">
          <button className="btn btn-secondary">Connexion</button>
          <button className="btn btn-primary">Inscription</button>
        </div>
      </div>
    </header>
  );
}

export default Header; 