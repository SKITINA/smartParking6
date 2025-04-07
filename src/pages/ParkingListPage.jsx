import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../services/api';
import { FaSearch, FaMapMarkerAlt, FaCar, FaEuroSign, FaStar, FaFilter } from 'react-icons/fa';

const ParkingCard = ({ parking }) => {
  const navigate = useNavigate();
  const defaultImage = 'https://via.placeholder.com/300x200?text=Parking';

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 parking-card card-animation">
      {/* Image Gallery */}
      <div className="relative h-48 parking-image">
        <img
          src={parking.imageUrl || defaultImage}
          alt={parking.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        {/* Image Gallery Thumbnails */}
        <div className="absolute bottom-4 left-4 flex gap-2 thumbnail-gallery opacity-0">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="w-12 h-12 rounded-lg bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden">
              <img
                src={parking.imageUrl || defaultImage}
                alt={`Vue ${index + 1}`}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {parking.name}
            </h3>
            <p className="text-sm text-gray-500 flex items-center">
              <FaMapMarkerAlt className="w-4 h-4 mr-1" />
              {parking.address}
            </p>
          </div>
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <FaStar className="text-blue-600 w-4 h-4 mr-1" />
            <span className="text-blue-600 font-medium">{parking.rating || '4.8'}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-gray-500 text-sm mb-1">Places disponibles</div>
            <div className="font-semibold text-gray-900">
              {parking.availableSpots} / {parking.totalSpots}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-gray-500 text-sm mb-1">Prix horaire</div>
            <div className="font-semibold text-gray-900 flex items-center">
              <FaEuroSign className="w-4 h-4 mr-1" />
              {parking.pricePerHour}/h
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(`/parking/${parking.id}/spots`)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium
                   hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Sélectionner une place
        </button>
      </div>
    </div>
  );
};

const ParkingListPage = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    priceRange: 'all',
    type: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = async () => {
    try {
      setLoading(true);
      const response = await parkingService.getAll();
      const validatedParkings = response.data.map(parking => ({
        id: parking.id || '',
        name: parking.name || 'Parking sans nom',
        city: parking.city || 'Ville non spécifiée',
        pricePerHour: parking.pricePerHour || 0,
        availableSpots: parking.availableSpots || 0,
        totalSpots: parking.totalSpots || 0,
        type: parking.type || 'public',
        address: parking.address || 'Adresse non spécifiée',
        imageUrl: parking.imageUrl || '',
        rating: parking.rating || 0
      }));
      setParkings(validatedParkings);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des parkings');
      console.error('Error fetching parkings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredParkings = parkings.filter(parking => {
    if (filters.city && !parking.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.type !== 'all' && parking.type !== filters.type) {
      return false;
    }
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (parking.pricePerHour < min || parking.pricePerHour > max) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="space-y-4">
          <div className="h-12 w-48 loading-skeleton rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-lg shadow-md h-96 w-full loading-skeleton"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      {/* Hero Section avec barre de recherche */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Trouvez votre place de parking idéale
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            {filteredParkings.length} parkings disponibles dans votre région
          </p>
          
          <div className="max-w-2xl relative">
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Rechercher par ville..."
              className="w-full py-3 px-4 pr-12 rounded-lg text-gray-900 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {/* Filtres */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm 
                     hover:shadow-md transition-shadow text-gray-700"
          >
            <FaFilter />
            Filtres
          </button>

          {showFilters && (
            <div className="w-full mt-4 bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix par heure
                  </label>
                  <select
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 
                             focus:ring-blue-500"
                  >
                    <option value="all">Tous les prix</option>
                    <option value="0-2">Moins de 2€</option>
                    <option value="2-5">2€ - 5€</option>
                    <option value="5-10">5€ - 10€</option>
                    <option value="10-999">Plus de 10€</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de parking
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 
                             focus:ring-blue-500"
                  >
                    <option value="all">Tous les types</option>
                    <option value="public">Public</option>
                    <option value="private">Privé</option>
                    <option value="underground">Souterrain</option>
                    <option value="outdoor">Extérieur</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Liste des parkings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParkings.map((parking) => (
            <ParkingCard key={parking.id} parking={parking} />
          ))}
        </div>

        {filteredParkings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🅿️</div>
            <p className="text-xl text-gray-500">
              Aucun parking ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingListPage; 