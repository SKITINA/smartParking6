import React from 'react';
import { Link } from 'react-router-dom';

function Confirmation() {
  return (
    <div className="fade-in">
      <div className="confirmation-container">
        <div className="confirmation-icon">✅</div>
        <h1 className="text-3xl font-bold text-center mb-4">
          Réservation confirmée !
        </h1>
        <p className="text-xl text-gray-600 text-center mb-8">
          Votre place de parking a été réservée avec succès.
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4">Détails de la réservation</h2>
          <div className="space-y-3">
            <p><strong>Numéro de réservation:</strong> #12345</p>
            <p><strong>Parking:</strong> Parking Central</p>
            <p><strong>Date:</strong> 12/04/2024</p>
            <p><strong>Heure d'arrivée:</strong> 14:00</p>
            <p><strong>Durée:</strong> 2 heures</p>
            <p><strong>Plaque d'immatriculation:</strong> AB-123-CD</p>
            <p><strong>Montant payé:</strong> 5.00€</p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Un email de confirmation a été envoyé à votre adresse email.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/map" className="btn btn-secondary">
              Voir sur la carte
            </Link>
            <button className="btn btn-primary">
              Télécharger le reçu
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Informations importantes</h3>
          <ul className="text-left max-w-2xl mx-auto space-y-2">
            <li>• Présentez-vous à l'heure indiquée avec votre véhicule</li>
            <li>• Ayez votre numéro de réservation à portée de main</li>
            <li>• En cas de retard, contactez le service client</li>
            <li>• La réservation peut être annulée jusqu'à 1h avant l'arrivée</li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Besoin d'aide ? Contactez notre service client au
            <a href="tel:+33123456789" className="text-primary ml-1">
              +33 1 23 45 67 89
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Confirmation; 