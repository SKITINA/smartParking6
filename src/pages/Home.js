import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="fade-in">
      <section className="hero-section text-center py-16">
        <h1 className="text-4xl font-bold mb-4">
          Trouvez et réservez votre place de parking en quelques clics
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Une solution intelligente pour gérer vos stationnements
        </p>
        <Link to="/map" className="btn btn-primary">
          Trouver un parking
        </Link>
      </section>

      <section className="features-section py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nos fonctionnalités principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="feature-card p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">Carte interactive</h3>
            <p className="text-gray-600">
              Localisez les parkings disponibles près de vous avec notre carte interactive
            </p>
          </div>

          <div className="feature-card p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">📷</div>
            <h3 className="text-xl font-semibold mb-2">Détection de plaque</h3>
            <p className="text-gray-600">
              Scannez votre plaque d'immatriculation pour une réservation rapide
            </p>
          </div>

          <div className="feature-card p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Paiement sécurisé</h3>
            <p className="text-gray-600">
              Payez en toute sécurité avec notre système de paiement intégré
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section py-16 bg-primary text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Prêt à simplifier votre stationnement ?
        </h2>
        <p className="text-xl mb-8">
          Rejoignez-nous dès maintenant et profitez de nos services
        </p>
        <Link to="/booking" className="btn btn-secondary">
          Commencer
        </Link>
      </section>
    </div>
  );
}

export default Home; 