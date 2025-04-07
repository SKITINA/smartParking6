import React, { useEffect, useRef } from 'react';

const MapView = ({ locations, center }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize map
    if (window.google && !mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: 0, lng: 0 },
        zoom: 12,
      });
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    if (locations && mapInstance.current) {
      locations.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: mapInstance.current,
          title: location.name,
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-bold">${location.name}</h3>
              <p>Available spots: ${location.availableSpots}/${location.totalSpots}</p>
              <p>Price: $${location.pricePerHour}/hour</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance.current, marker);
        });

        markersRef.current.push(marker);
      });
    }
  }, [locations, center]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-lg shadow-md"
    />
  );
};

export default MapView; 