import React, { useState, useEffect } from 'react';
import { reservationService } from '../services/api';
import '../styles/DashboardUser.css';

function DashboardUser() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const testimonials = [
    {
      id: 1,
      initial: "Z",
      text: "Easy to follow instructions. Plenty of parking spaces and very secure. Would recommend!"
    },
    {
      id: 2,
      initial: "M",
      text: "Hotel easy to spot in plenty of time. Bus lane not a problem. Followed directions perfectly."
    },
    {
      id: 3,
      initial: "H",
      text: "Very convenient and competitively priced. Shuttle service was prompt and efficient."
    }
  ];

  const pricingPlans = [
    {
      id: 1,
      type: "Weekly Pass",
      price: "$25",
      period: "per week",
      icon: "calendar",
      features: [
        "Unlimited access",
        "24/7 Support",
        "Email alerts"
      ]
    },
    {
      id: 2,
      type: "Monthly Pass",
      price: "$80",
      period: "per month",
      icon: "calendar-alt",
      features: [
        "Unlimited access",
        "Priority support",
        "Email and SMS alerts"
      ]
    },
    {
      id: 3,
      type: "Yearly Pass",
      price: "$800",
      period: "per year",
      icon: "calendar-check",
      features: [
        "Unlimited access",
        "Dedicated support",
        "All notifications",
        "Annual reports"
      ]
    }
  ];

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const response = await reservationService.getUserReservations();
      setReservations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reservations');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await reservationService.cancel(id);
        setReservations(reservations.filter(res => res.id !== id));
      } catch (err) {
        setError('Failed to delete reservation');
      }
    }
  };

  const toggleDetails = (id) => {
    setReservations(reservations.map(res => {
      if (res.id === id) {
        return { ...res, isExpanded: !res.isExpanded };
      }
      return res;
    }));
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="testimonials-section">
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="user-initial">{testimonial.initial}</div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="apps-section">
        <h2>OUR APPS</h2>
        <div className="app-buttons">
          <a href="#" className="app-button">
            <img src="/app-store.png" alt="Download on App Store" />
          </a>
          <a href="#" className="app-button">
            <img src="/google-play.png" alt="Get it on Google Play" />
          </a>
        </div>
      </div>

      <div className="footer-links">
        <div className="links-section">
          <h3>BOOK PARKING</h3>
          <ul>
            <li><a href="#">NYC PARKING</a></li>
            <li><a href="#">CHICAGO PARKING</a></li>
            <li><a href="#">WASHINGTON DC PARKING</a></li>
          </ul>
        </div>

        <div className="links-section">
          <h3>CONTACT US</h3>
          <ul>
            <li><a href="#">ABOUT US</a></li>
            <li><a href="#">SUPPORT</a></li>
          </ul>
        </div>

        <div className="links-section">
          <h3>RESOURCES</h3>
          <ul>
            <li><a href="#">SITEMAP</a></li>
            <li><a href="#">PRIVACY POLICY</a></li>
            <li><a href="#">ADD PARKING TO YOUR WEBSITE</a></li>
          </ul>
        </div>
      </div>

      <div className="dashboard-header">
        <h1>Choose Your Plan</h1>
        <p>Select the best parking plan for your needs</p>
      </div>

      <div className="pricing-section">
        <div className="pricing-grid">
          {pricingPlans.map(plan => (
            <div key={plan.id} className="pricing-card">
              <div className="pricing-header">
                <i className={`fas fa-${plan.icon}`}></i>
                <h3>{plan.type}</h3>
                <p className="period">{plan.period}</p>
                <div className="price">{plan.price}</div>
              </div>
              <div className="pricing-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <i className="fas fa-check"></i>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button className="choose-plan-btn">
                {`CHOOSE ${plan.type.toUpperCase().split(' ')[0]}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="reservations-section">
        <h2>My Reservations</h2>
        <div className="reservations-table-container">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <React.Fragment key={reservation.id}>
                  <tr className={reservation.isExpanded ? 'expanded' : ''}>
                    <td>{new Date(reservation.dateParking).toLocaleDateString()}</td>
                    <td>{reservation.parkingSpot?.name}</td>
                    <td>{reservation.duration} hours</td>
                    <td>${reservation.totalAmount}</td>
                    <td>
                      <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="action-button details"
                        onClick={() => toggleDetails(reservation.id)}
                      >
                        {reservation.isExpanded ? 'Hide' : 'Details'}
                      </button>
                      <button 
                        className="action-button delete"
                        onClick={() => handleDelete(reservation.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {reservation.isExpanded && (
                    <tr className="details-row">
                      <td colSpan="6">
                        <div className="reservation-details">
                          <div className="detail-item">
                            <span>Parking Spot:</span>
                            <span>{reservation.parkingSpot?.name}</span>
                          </div>
                          <div className="detail-item">
                            <span>Entry Time:</span>
                            <span>{new Date(reservation.dateParking).toLocaleTimeString()}</span>
                          </div>
                          <div className="detail-item">
                            <span>Exit Time:</span>
                            <span>
                              {new Date(new Date(reservation.dateParking).getTime() + 
                                reservation.duration * 60 * 60 * 1000).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span>License Plate:</span>
                            <span>{reservation.licensePlate}</span>
                          </div>
                          <div className="detail-item">
                            <span>Payment Status:</span>
                            <span>{reservation.paymentStatus}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardUser; 