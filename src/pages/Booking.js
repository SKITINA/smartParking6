import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt, FaParking, FaClock, FaWalking } from 'react-icons/fa';
import { parkingService } from '../services/api';
import '../styles/Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [filters, setFilters] = useState({
    distance: 5,
    price: 10,
    vehicleType: 'car'
  });

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        setLoading(true);
        const response = await parkingService.getAll();
        setParkings(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des parkings');
        console.error(err);
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

  const handleParkingSelect = (parking) => {
    setSelectedParking(parking);
  };

  const handleProceedToPayment = () => {
    if (selectedParking) {
      navigate('/payment', { state: { parking: selectedParking } });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des parkings disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1>Réserver une place de parking</h1>
        <p>Sélectionnez un emplacement disponible</p>
      </div>

      <div className="booking-content">
        <div className="filters-section">
          <h2>Filtres</h2>
          <div className="filter-group">
            <label htmlFor="distance">Distance maximale (km)</label>
            <input
              type="range"
              id="distance"
              name="distance"
              min="1"
              max="20"
              value={filters.distance}
              onChange={handleFilterChange}
            />
            <span>{filters.distance} km</span>
          </div>

          <div className="filter-group">
            <label htmlFor="price">Prix maximum (€/h)</label>
            <input
              type="range"
              id="price"
              name="price"
              min="1"
              max="20"
              value={filters.price}
              onChange={handleFilterChange}
            />
            <span>{filters.price} €/h</span>
          </div>

          <div className="filter-group">
            <label htmlFor="vehicleType">Type de véhicule</label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={filters.vehicleType}
              onChange={handleFilterChange}
            >
              <option value="car">Voiture</option>
              <option value="motorcycle">Moto</option>
              <option value="bicycle">Vélo</option>
              <option value="van">Camionnette</option>
            </select>
          </div>
        </div>

        <div className="map-section">
          <MapContainer
            center={[48.8566, 2.3522]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {parkings.map(parking => (
              <Marker
                key={parking.id}
                position={[parking.latitude, parking.longitude]}
                eventHandlers={{
                  click: () => handleParkingSelect(parking)
                }}
              >
                <Popup>
                  <div className="parking-popup">
                    <h3>{parking.name}</h3>
                    <p><FaParking /> Places disponibles: {parking.availableSpots}</p>
                    <p><FaClock /> Prix: {parking.pricePerHour}€/h</p>
                    <p><FaWalking /> Distance: {parking.distance}m</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="parking-list">
          <h2>Emplacements disponibles</h2>
          {parkings.map(parking => (
            <div
              key={parking.id}
              className={`parking-card ${selectedParking?.id === parking.id ? 'selected' : ''}`}
              onClick={() => handleParkingSelect(parking)}
            >
              <div className="parking-info">
                <h3>{parking.name}</h3>
                <p><FaParking /> Places disponibles: {parking.availableSpots}</p>
                <p><FaClock /> Prix: {parking.pricePerHour}€/h</p>
                <p><FaWalking /> Distance: {parking.distance}m</p>
              </div>
              <div className="parking-actions">
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleParkingSelect(parking);
                  }}
                >
                  Sélectionner
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedParking && (
        <div className="selected-parking">
          <h2>Parking sélectionné</h2>
          <div className="selected-parking-info">
            <h3>{selectedParking.name}</h3>
            <p><FaParking /> Places disponibles: {selectedParking.availableSpots}</p>
            <p><FaClock /> Prix: {selectedParking.pricePerHour}€/h</p>
            <p><FaWalking /> Distance: {selectedParking.distance}m</p>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleProceedToPayment}
          >
            Procéder au paiement
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking; 