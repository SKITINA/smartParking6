import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationService } from '../services/api';

function MyReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await reservationService.getUserReservations();
        setReservations(response.data);
      } catch (err) {
        setError('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handlePayment = (reservationId) => {
    navigate('/payment', { 
      state: { 
        reservationDetails: reservations.find(r => r.id === reservationId) 
      } 
    });
  };

  if (loading) return <div>Loading your reservations...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-reservations-page">
      <h1>My Reservations</h1>

      {reservations.length === 0 ? (
        <div className="no-reservations">
          <p>You don't have any reservations yet.</p>
          <button onClick={() => navigate('/upload')}>
            Make a Reservation
          </button>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map(reservation => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-header">
                <h3>Spot {reservation.spotName}</h3>
                <span className={`status ${reservation.status.toLowerCase()}`}>
                  {reservation.status}
                </span>
              </div>

              <div className="reservation-details">
                <p>
                  <strong>Date:</strong> {new Date(reservation.dateParking).toLocaleDateString()}
                </p>
                <p>
                  <strong>Duration:</strong> {reservation.duration} hours
                </p>
                <p>
                  <strong>License Plate:</strong> {reservation.licensePlate}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${reservation.totalAmount}
                </p>
              </div>

              {reservation.status === 'PENDING_PAYMENT' && (
                <button
                  onClick={() => handlePayment(reservation.id)}
                  className="pay-button"
                >
                  Complete Payment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservationsPage; 