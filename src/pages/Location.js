import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { parkingService } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function Location() {
  const navigate = useNavigate();
  const [position, setPosition] = useState([48.8566, 2.3522]); // Paris par défaut
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    distance: 5,
    price: 'all',
    vehicleType: 'all'
  });

  useEffect(() => {
    // Géolocalisation de l'utilisateur
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        console.log('Erreur de géolocalisation');
      }
    );

    // Charger les parkings depuis l'API
    const fetchParkings = async () => {
      try {
        setLoading(true);
        const response = await parkingService.getAll();
        setParkings(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des parkings:', err);
        setError('Impossible de charger les parkings. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCarSelection = () => {
    navigate('/car-selection');
  };

  const handleBooking = (parkingId) => {
    navigate('/booking', { state: { parkingId } });
  };

  if (loading) {
    return <div className="text-center p-8">Chargement des parkings...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="fade-in">
      <div className="location-header">
        <h1 className="text-3xl font-bold text-center mb-4">
          Trouvez un parking près de vous
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sélectionnez un parking et réservez votre place en quelques clics
        </p>
      </div>

      <div className="filters-container mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="filter-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance (km)
            </label>
            <input
              type="range"
              name="distance"
              min="1"
              max="20"
              value={filters.distance}
              onChange={handleFilterChange}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{filters.distance} km</span>
          </div>

          <div className="filter-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix
            </label>
            <select
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="all">Tous les prix</option>
              <option value="free">Gratuit</option>
              <option value="paid">Payant</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de véhicule
            </label>
            <select
              name="vehicleType"
              value={filters.vehicleType}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="all">Tous les types</option>
              <option value="car">Voiture</option>
              <option value="motorcycle">Moto</option>
              <option value="bicycle">Vélo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="map-container h-[500px] rounded-lg overflow-hidden shadow-md mb-6">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {parkings.map(parking => (
            <Marker key={parking.id} position={[parking.latitude, parking.longitude]}>
              <Popup>
                <div>
                  <h3 className="font-bold">{parking.name}</h3>
                  <p>Places disponibles: {parking.availableSpots}</p>
                  <p>Prix: {parking.pricePerHour}€/heure</p>
                  <p>Horaires: {parking.openingHours}</p>
                  <button 
                    className="btn btn-primary mt-2"
                    onClick={() => handleBooking(parking.id)}
                  >
                    Réserver
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="parking-list mb-8">
        <h2 className="text-2xl font-bold mb-4">Parkings à proximité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parkings.map(parking => (
            <div key={parking.id} className="parking-card p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{parking.name}</h3>
              <p className="text-gray-600 mb-2">{parking.address}</p>
              <div className="flex justify-between mb-2">
                <span className="text-green-600 font-medium">
                  {parking.availableSpots} places disponibles
                </span>
                <span className="text-blue-600 font-medium">
                  {parking.pricePerHour}€/heure
                </span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {parking.distance ? `${parking.distance.toFixed(1)} km` : 'Distance inconnue'}
                </span>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleBooking(parking.id)}
                >
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <button 
          className="btn btn-secondary mr-4"
          onClick={handleCarSelection}
        >
          Sélectionner un véhicule
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/license-plate-detection')}
        >
          Scanner une plaque
        </button>
      </div>
    </div>
  );
}

export default Location; 