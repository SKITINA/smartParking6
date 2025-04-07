import React, { useState, useEffect } from 'react';

const CarSelectionForm = ({ onSelect, selectedCar }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cars', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }

      const data = await response.json();
      setCars(data);
    } catch (err) {
      setError('Failed to load cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewCar = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const carData = {
      brand: formData.get('brand'),
      model: formData.get('model'),
      licensePlate: formData.get('licensePlate'),
      color: formData.get('color'),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        throw new Error('Failed to add car');
      }

      const newCar = await response.json();
      setCars([...cars, newCar]);
      onSelect(newCar);
    } catch (err) {
      setError('Failed to add car. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading cars...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Your Car</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {cars.map((car) => (
          <div
            key={car.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors duration-300 ${
              selectedCar?.id === car.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onSelect(car)}
          >
            <h3 className="font-semibold text-lg">
              {car.brand} {car.model}
            </h3>
            <p className="text-gray-600">License: {car.licensePlate}</p>
            <p className="text-gray-600">Color: {car.color}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Add New Car</h3>
        <form onSubmit={handleAddNewCar} className="space-y-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
              License Plate
            </label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Car
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarSelectionForm; 