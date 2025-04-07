import React, { useState, useRef } from 'react';
import axios from 'axios';
import LocationForm from '../components/map/LocationForm';
import MapView from '../components/map/MapView';


const apiKey = '40fcbde3fd7c42faae8b8e189eb10ce9'; // Your API key

const MapComponent = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
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

  const handleLocationInput = (e) => {
    const inputLocation = e.target.value;
    setLocation(inputLocation);
    if (inputLocation.length > 3) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        fetchLocation(inputLocation);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Search completed successfully!');
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LocationForm
        location={location}
        handleLocationInput={handleLocationInput}
        handleLocationDetect={handleLocationDetect}
        locationError={locationError}
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        message={message}
      />
      <div style={{ width: '70%', zIndex: 10, height: '92%', marginTop: '50px' }}>
        <MapView searchedCoords={searchedCoords} location={location} />
      </div>
    </div>
  );
};

export default MapComponent;
