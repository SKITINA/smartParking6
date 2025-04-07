import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../services/api';
import MapComponent from './MapComponent';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [parkingType, setParkingType] = useState('hourly');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await parkingService.searchParkings({
        location: searchLocation,
        type: parkingType
      });
      navigate('/parking-list', { state: { parkings: response.data } });
    } catch (error) {
      console.error('Error searching parkings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="home-container" 
      style={{ 
        backgroundImage: `url('/assets/park2.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <div className="hero-section">
        <h1>Find Parking Made Easy</h1>
        <p className="subtitle">Ensuring the best prices and trusted by millions</p>

        <div className="search-container">
          <div className="parking-types">
            <button 
              className={`type-button ${parkingType === 'hourly' ? 'active' : ''}`}
              onClick={() => setParkingType('hourly')}
            >
              Hourly/Daily
            </button>
            <button 
              className={`type-button ${parkingType === 'monthly' ? 'active' : ''}`}
              onClick={() => setParkingType('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`type-button ${parkingType === 'yearly' ? 'active' : ''}`}
              onClick={() => setParkingType('yearly')}
            >
              Yearly
            </button>
          </div>

          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Where do you want to park?"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Find Parking'}
            </button>
          </form>
        </div>
      </div>

      <section style={{ marginTop: '3rem', padding: '1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Explore on Map</h2>
        <MapComponent />
      </section>

      <div className="testimonials-section">
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="user-initial">Z</div>
            <p className="testimonial-text">
              "Easy to follow instructions. Plenty of parking spaces and very secure. Would recommend!"
            </p>
          </div>
          <div className="testimonial-card">
            <div className="user-initial">M</div>
            <p className="testimonial-text">
              "Hotel easy to spot in plenty of time. Bus lane not a problem. Followed directions perfectly."
            </p>
          </div>
          <div className="testimonial-card">
            <div className="user-initial">H</div>
            <p className="testimonial-text">
              "Very convenient and competitively priced. Shuttle service was prompt and efficient."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;