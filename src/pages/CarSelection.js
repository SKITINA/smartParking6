import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CarSelection() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    plateNumber: ''
  });

  const vehicleTypes = [
    {
      id: 'car',
      name: 'Voiture',
      icon: '🚗',
      description: 'Voiture particulière, berline, SUV, etc.'
    },
    {
      id: 'motorcycle',
      name: 'Moto',
      icon: '🏍️',
      description: 'Moto, scooter, cyclomoteur'
    },
    {
      id: 'bicycle',
      name: 'Vélo',
      icon: '🚲',
      description: 'Vélo, vélo électrique'
    },
    {
      id: 'van',
      name: 'Fourgon',
      icon: '🚐',
      description: 'Fourgon, camionnette'
    },
    {
      id: 'truck',
      name: 'Camion',
      icon: '🚛',
      description: 'Camion, poids lourd'
    }
  ];

  const handleVehicleSelect = (vehicleId) => {
    setSelectedVehicle(vehicleId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enregistrer les informations du véhicule
    localStorage.setItem('selectedVehicle', JSON.stringify({
      type: selectedVehicle,
      ...formData
    }));
    
    // Rediriger vers la page de détection de plaque
    navigate('/license-plate-detection');
  };

  const handleSkip = () => {
    // Rediriger directement vers la page de détection de plaque
    navigate('/license-plate-detection');
  };

  return (
    <div className="fade-in">
      <div className="car-selection-container">
        <h1 className="text-3xl font-bold text-center mb-8">
          Sélectionnez votre véhicule
        </h1>
        
        <div className="vehicle-types mb-8">
          <h2 className="text-xl font-semibold mb-4">Type de véhicule</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {vehicleTypes.map(vehicle => (
              <div 
                key={vehicle.id}
                className={`vehicle-card p-4 rounded-lg cursor-pointer transition-all ${
                  selectedVehicle === vehicle.id 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'bg-white border border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleVehicleSelect(vehicle.id)}
              >
                <div className="text-4xl mb-2">{vehicle.icon}</div>
                <h3 className="font-semibold">{vehicle.name}</h3>
                <p className="text-sm text-gray-600">{vehicle.description}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedVehicle && (
          <div className="vehicle-details">
            <h2 className="text-xl font-semibold mb-4">Détails du véhicule</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marque
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Ex: Renault, Peugeot, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modèle
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Ex: Clio, 208, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Ex: 2020"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Ex: Blanc, Noir, etc."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plaque d'immatriculation
                  </label>
                  <input
                    type="text"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Ex: AB-123-CD"
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="btn btn-secondary"
                >
                  Scanner une plaque
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Continuer
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarSelection; 