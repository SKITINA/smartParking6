import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCar, FaCheckCircle } from 'react-icons/fa';

const DetectionResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plate, imageUrl, vehicleType } = location.state || {};

  if (!plate) {
    navigate('/license-plate-detection');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header avec succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <FaCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Plaque détectée avec succès !
          </h1>
          <p className="text-gray-600">
            Voici les informations détectées pour votre véhicule
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image du véhicule */}
          {imageUrl && (
            <div className="relative h-64">
              <img
                src={imageUrl}
                alt="Vehicle"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {/* Informations détectées */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plaque d'immatriculation */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">
                  Plaque détectée
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {plate.toUpperCase()}
                </div>
              </div>

              {/* Type de véhicule */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">
                  Type de véhicule
                </div>
                <div className="flex items-center text-gray-900">
                  <FaCar className="w-5 h-5 mr-2" />
                  <span className="text-lg font-medium">
                    {vehicleType}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/license-plate-detection')}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700
                         py-3 px-6 rounded-xl font-medium hover:bg-gray-50
                         transition-colors flex items-center justify-center gap-2"
              >
                <FaArrowLeft />
                Nouvelle détection
              </button>
              <button
                onClick={() => navigate('/parking-selection')}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl
                         font-medium hover:bg-blue-700 transition-colors"
              >
                Réserver un stationnement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionResultPage; 