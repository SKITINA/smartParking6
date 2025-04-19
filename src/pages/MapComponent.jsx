import React, { useState, useRef } from 'react';
import axios from 'axios';
import LocationForm from '../components/map/LocationForm';
import MapView from '../components/map/MapView';

const apiKey = '40fcbde3fd7c42faae8b8e189eb10ce9'; // Your API key

const MapComponent = () => {
  const [location, setLocation] = useState('');
  const [searchedCoords, setSearchedCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [locationError, setLocationError] = useState('');
  const debounceTimer = useRef(null);

  const fetchLocation = async (query) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        setLocation(response.data.results[0].formatted);
        setSearchedCoords([lat, lng]);
      }
    } catch (error) {
      setLocationError('Unable to retrieve the location');
      console.error(error);
    }
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    if (selectedLocation.length > 3) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        fetchLocation(selectedLocation);
      }, 4000);
    }
  };

  const handleLocationDetect = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setSearchedCoords([latitude, longitude]);
      const query = `${latitude}+${longitude}`;
      fetchLocation(query);
    }, () => {
      setLocationError('Unable to retrieve your location');
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '30%', padding: '20px' }}>
        <LocationForm onLocationSelect={handleLocationSelect} />
        {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
        <button 
          onClick={handleLocationDetect}
          style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Detect My Location
        </button>
      </div>
      <div style={{ width: '70%', zIndex: 10, height: '92%', marginTop: '50px' }}>
        <MapView 
          locations={searchedCoords ? [{ lat: searchedCoords[0], lng: searchedCoords[1], name: location }] : []}
          center={searchedCoords ? { lat: searchedCoords[0], lng: searchedCoords[1] } : { lat: 0, lng: 0 }}
        />
      </div>
    </div>
  );
};

export default MapComponent;
