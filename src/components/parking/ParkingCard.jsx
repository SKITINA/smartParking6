import React from 'react';
import { Link } from 'react-router-dom';

const ParkingCard = ({ parking }) => {
  // Add default values and validation
  const {
    id,
    name = 'Unnamed Parking',
    address = 'Address not available',
    totalSpots = 0,
    availableSpots = 0,
    pricePerHour = 0,
    imageUrl = 'https://via.placeholder.com/300x200?text=No+Image',
    rating = 0
  } = parking || {};

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
          {availableSpots} spots left
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <div className="flex items-center mb-2">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 text-gray-600">{rating.toFixed(1)}</span>
        </div>
        <p className="text-gray-600 mb-4">{address}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            <span className="font-semibold">${pricePerHour.toFixed(2)}</span>/hour
          </div>
          <Link
            to={`/parking/${id}/reserve`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reserve
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParkingCard; 