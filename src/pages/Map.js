import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../services/api';
import 'leaflet/dist/leaflet.css';

function Map() {
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
      <div className="filters-container">
        <div className="filter-group">
          <div className="form-group">
            <label className="form-label">Distance (km)</label>
            <input
              type="range"
              name="distance"
              min="1"
              max="20"
              value={filters.distance}
              onChange={handleFilterChange}
              className="form-input"
            />
            <span>{filters.distance} km</span>
          </div>

          <div className="form-group">
            <label className="form-label">Prix</label>
            <select
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              className="form-input"
            >
              <option value="all">Tous les prix</option>
              <option value="free">Gratuit</option>
              <option value="paid">Payant</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Type de véhicule</label>
            <select
              name="vehicleType"
              value={filters.vehicleType}
              onChange={handleFilterChange}
              className="form-input"
            >
              <option value="all">Tous les types</option>
              <option value="car">Voiture</option>
              <option value="motorcycle">Moto</option>
              <option value="bicycle">Vélo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="map-container">
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
    </div>
  );
}

export default Map; 