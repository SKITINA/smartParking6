import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingService, parkingSpotService, reservationService } from '../../services/api';

const AutoReservation = ({ plateNumber }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableParkings, setAvailableParkings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const findAvailableParking = async () => {
      if (!plateNumber) return;

      setLoading(true);
      setError('');

      try {
        // 1. Récupérer tous les parkings
        const parkingsResponse = await parkingService.getAll();
        const parkings = parkingsResponse.data;

        // 2. Pour chaque parking, vérifier les places disponibles
        const availableSpotsPromises = parkings.map(async (parking) => {
          const spotsResponse = await parkingSpotService.getAvailableSpots(parking.id);
          return {
            ...parking,
            availableSpots: spotsResponse.data
          };
        });

        const parkingsWithSpots = await Promise.all(availableSpotsPromises);
        
        // 3. Filtrer les parkings avec des places disponibles
        const available = parkingsWithSpots.filter(p => p.availableSpots.length > 0);
        setAvailableParkings(available);

        if (available.length === 0) {
          setError('Aucune place de parking disponible pour le moment.');
        }
      } catch (err) {
        setError('Erreur lors de la recherche de places disponibles.');
        console.error('Reservation error:', err);
      } finally {
        setLoading(false);
      }
    };

    findAvailableParking();
  }, [plateNumber]);

  const handleReservation = async (parkingId, spotId) => {
    setLoading(true);
    setError('');

    try {
      // Créer la réservation
      const reservation = await reservationService.create({
        parkingId,
        spotId,
        plateNumber,
        startTime: new Date().toISOString(),
        duration: 60 // 1 heure par défaut
      });

      // Rediriger vers la page de confirmation
      navigate(`/reservation/${reservation.data.id}/confirmation`);
    } catch (err) {
      setError('Erreur lors de la création de la réservation.');
      console.error('Reservation creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Recherche de places disponibles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Réservation Automatique</h2>
        <p className="text-gray-600 mb-6">
          Plaque détectée : <span className="font-semibold">{plateNumber}</span>
        </p>

        {availableParkings.length > 0 ? (
          <div className="space-y-4">
            {availableParkings.map((parking) => (
              <div key={parking.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{parking.name}</h3>
                <p className="text-gray-600 mb-2">{parking.address}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Places disponibles : {parking.availableSpots.length}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {parking.availableSpots.slice(0, 2).map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => handleReservation(parking.id, spot.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Réserver Place {spot.number}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            Aucune place de parking disponible pour le moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default AutoReservation; 