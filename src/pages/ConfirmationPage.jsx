import { useLocation, useNavigate } from 'react-router-dom';

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservationDetails } = location.state || {};

  return (
    <div className="confirmation-page">
      <h1>Reservation Confirmed!</h1>
      <div className="confirmation-details">
        <p>Your parking spot has been reserved successfully.</p>
        <div className="details">
          <p><strong>Spot Number:</strong> {reservationDetails?.spotName}</p>
          <p><strong>Duration:</strong> {reservationDetails?.duration} hours</p>
          <p><strong>Total Amount:</strong> ${reservationDetails?.totalAmount}</p>
        </div>
        <button onClick={() => navigate('/my-reservations')}>
          View My Reservations
        </button>
      </div>
    </div>
  );
}

export default ConfirmationPage; 