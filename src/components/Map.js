import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const parkingSpots = [
  {
    id: 1,
    name: "Parking Central",
    position: [48.8566, 2.3522],
    available: 25,
  },
  {
    id: 2,
    name: "Parking Nord",
    position: [48.8606, 2.3376],
    available: 15,
  },
  // Add more parking spots as needed
];

const Map = () => {
  return (
    <div className="map-container">
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parkingSpots.map((spot) => (
          <Marker key={spot.id} position={spot.position}>
            <Popup>
              <div className="parking-popup">
                <h3 className="font-bold">{spot.name}</h3>
                <p className="text-sm">
                  Places disponibles: <span className="text-primary font-bold">{spot.available}</span>
                </p>
                <button className="btn btn-primary mt-2 text-sm">
                  Réserver une place
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map; 