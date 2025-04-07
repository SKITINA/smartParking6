import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parkingService } from '../services/api';
import { FaArrowLeft } from 'react-icons/fa';

const ParkingSpot = ({ spot, isSelected, onSelect, isAvailable }) => {
  const baseClasses = `
    w-20 h-20 rounded-lg flex items-center justify-center
    transition-all duration-200 cursor-pointer
    border-2 font-medium text-sm parking-spot
    ${isAvailable ? '' : 'disabled'}
    ${isSelected ? 'selected' : ''}
  `;

  const stateClasses = isAvailable
    ? isSelected
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50';

  return (
    <div
      className={`${baseClasses} ${stateClasses}`}
      onClick={() => isAvailable && onSelect(spot)}
    >
      {spot.code}
    </div>
  );
};

const ParkingSpotPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parking, setParking] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParkingDetails();
  }, [id]);

  const fetchParkingDetails = async () => {
    try {
      setLoading(true);
      const response = await parkingService.getById(id);
      setParking(response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des informations du parking');
      console.error('Error fetching parking details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpotSelection = (spot) => {
    setSelectedSpot(spot);
  };

  const handleContinue = () => {
    if (selectedSpot) {
      navigate(`/parking/${id}/payment`, {
        state: { spotId: selectedSpot.id }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="space-y-4">
          <div className="h-8 w-64 loading-skeleton rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-20 w-20 loading-skeleton rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Exemple de données de places de parking
  const parkingSpots = [
    ['A01', 'A02', 'A03', 'A04'],
    ['B01', 'B02', 'B03', 'B04'],
    ['C01', 'C02', 'C03', 'C04'],
    ['D01', 'D02', 'D03', 'D04'],
  ].map(row => row.map(code => ({
    id: code,
    code,
    isAvailable: Math.random() > 0.3 // Simulation de disponibilité
  })));

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Sélectionner une place
          </h1>
        </div>

        {/* Parking Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="grid grid-cols-4 gap-4 mb-8 spot-grid">
            {parkingSpots.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((spot) => (
                  <ParkingSpot
                    key={spot.id}
                    spot={spot}
                    isSelected={selectedSpot?.id === spot.id}
                    isAvailable={spot.isAvailable}
                    onSelect={handleSpotSelection}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded mr-2"></div>
              Disponible
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
              Sélectionné
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
              Occupé
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedSpot}
          className={`w-full py-4 rounded-xl font-medium transition-colors duration-200
                     ${selectedSpot
                       ? 'bg-blue-600 text-white hover:bg-blue-700'
                       : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                     }`}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

export default ParkingSpotPage; 