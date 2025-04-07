import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarSelectionPage.css';

function CarSelectionPage() {
  const navigate = useNavigate();
  const [carType, setCarType] = useState('');
  const [carCount, setCarCount] = useState(0);

  const handleContinue = () => {
    if (!carType) {
      alert('Please select a car type');
      return;
    }

    // ✅ Il manquait cette accolade de fermeture ici !
    navigate('/license-plate-detection');
  };

  return (
    <div className="car-selection-page">
      <div className="car-selection-content">
        <h1>Tell us a little about your Car</h1>

        <div className="car-form">
          <div className="form-group">
            <label>What type of Car do you have?</label>
            <select 
              value={carType} 
              onChange={(e) => setCarType(e.target.value)}
              className="car-type-select"
            >
              <option value="">Select car type</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="form-group">
            <label>How many cars do you want to park?</label>
            <div className="car-count-control">
              <button 
                type="button" 
                onClick={() => carCount > 0 && setCarCount(carCount - 1)}
                className="count-button"
              >
                -
              </button>
              <span className="car-count">{carCount}</span>
              <button 
                type="button" 
                onClick={() => setCarCount(carCount + 1)}
                className="count-button"
              >
                +
              </button>
            </div>
          </div>

          <button 
            onClick={handleContinue}
            className="continue-button"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarSelectionPage;
