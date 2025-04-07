function ParkingCard({ spot }) {
  return (
    <div className="parking-card">
      <div className="parking-card-header">
        <h3>{spot.name}</h3>
        <span className={`status ${spot.status.toLowerCase()}`}>
          {spot.status}
        </span>
      </div>
      <div className="parking-card-body">
        <p>Location: {spot.parking.city}</p>
        <p>Status: {spot.status}</p>
        {spot.status === 'AVAILABLE' && (
          <button className="reserve-button">
            Reserve Now
          </button>
        )}
      </div>
    </div>
  );
}

export default ParkingCard; 