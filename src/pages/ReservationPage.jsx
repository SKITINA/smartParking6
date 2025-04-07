import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { reservationService, parkingService, parkingSpotService } from '../services/api';

const ReservationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    parkingId: '',
    spotId: '',
    startTime: '',
    duration: 60,
    licensePlate: ''
  });
  const [parking, setParking] = useState(null);
  const [spot, setSpot] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (location.state) {
      const { parkingId, spotId } = location.state;
      setFormData(prev => ({
        ...prev,
        parkingId,
        spotId
      }));
      fetchParkingAndSpotDetails(parkingId, spotId);
    }
  }, [location]);

  const fetchParkingAndSpotDetails = async (parkingId, spotId) => {
    try {
      setLoading(true);
      // Récupérer les détails du parking
      const parkingResponse = await parkingService.getById(parkingId);
      setParking(parkingResponse.data);

      // Récupérer les détails de la place
      const spotResponse = await parkingSpotService.getById(spotId);
      setSpot(spotResponse.data);

      // Calculer le prix total
      const price = parkingResponse.data.pricePerHour * (formData.duration / 60);
      setTotalPrice(price);
    } catch (err) {
      setError('Erreur lors du chargement des détails. Veuillez réessayer.');
      console.error('Error fetching details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Recalculer le prix si la durée change
    if (name === 'duration' && parking) {
      const price = parking.pricePerHour * (value / 60);
      setTotalPrice(price);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await reservationService.create(formData);
      navigate(`/payment/${response.data.id}`);
    } catch (err) {
      setError('Erreur lors de la création de la réservation. Veuillez réessayer.');
      console.error('Reservation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Réserver une Place</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Résumé de la réservation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Résumé de la réservation</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="mb-2">
                <span className="font-semibold">Parking :</span> {parking?.name}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Place :</span> {spot?.number}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Prix par heure :</span> {parking?.pricePerHour}€
              </p>
              <p className="text-lg font-semibold text-blue-600">
                Prix total : {totalPrice.toFixed(2)}€
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date et heure de début
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (en minutes)
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="60">1 heure</option>
                <option value="120">2 heures</option>
                <option value="180">3 heures</option>
                <option value="240">4 heures</option>
                <option value="300">5 heures</option>
                <option value="360">6 heures</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plaque d'immatriculation
              </label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                required
                pattern="[A-Z0-9-]+"
                placeholder="ABC-123"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Création de la réservation...' : 'Continuer vers le paiement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationPage; 