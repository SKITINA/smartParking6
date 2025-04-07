import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import '../styles/EditProfile.css';

function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    autoCharge: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getCurrentUser();
        setFormData({
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phone || '',
          autoCharge: response.data.autoCharge || false
        });
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId'); // Assurez-vous de stocker l'ID lors de la connexion
      await userService.update(userId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        autoCharge: formData.autoCharge
      });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="profile-header">
        <div className="header-nav">
          <div className="logo">
            <img src="/parking-logo.png" alt="Parking.com" />
          </div>
          <div className="nav-links">
            <a href="#">THE APPS</a>
            <a href="#">CITIES</a>
            <a href="#">SUPPORT</a>
            <a href="#">MONTHLY ACCOUNTS</a>
            <div className="user-menu">
              <a href="#">MY ACCOUNT ▼</a>
            </div>
            <div className="language-selector">
              <span className="flag">🇺🇸</span>
              <span>USA ▼</span>
            </div>
          </div>
        </div>
        <button className="search-parking-btn">SEARCH FOR PARKING</button>
      </div>

      <div className="profile-content">
        <div className="sidebar">
          <h2>My Account</h2>
          <p className="user-email">{formData.email}</p>
          
          <div className="settings-section">
            <h3>ACCOUNT SETTINGS</h3>
            <ul>
              <li className="active">
                <i className="fas fa-user"></i>
                Profile
              </li>
              <li>
                <i className="fas fa-credit-card"></i>
                Payment Methods
              </li>
              <li>
                <i className="fas fa-car"></i>
                Vehicles
              </li>
            </ul>
          </div>

          <div className="settings-section">
            <h3>MY PARKING</h3>
            <ul>
              <li>
                <i className="fas fa-ticket-alt"></i>
                Monthly Parking
              </li>
            </ul>
          </div>
        </div>

        <div className="edit-form">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>EMAIL ADDRESS*</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>FIRST NAME*</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>LAST NAME*</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>MOBILE NUMBER*</label>
              <div className="phone-input">
                <select className="country-code">
                  <option value="+1">🇺🇸 +1</option>
                </select>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="autoCharge"
                checked={formData.autoCharge}
                onChange={(e) => setFormData({...formData, autoCharge: e.target.checked})}
              />
              <label htmlFor="autoCharge">
                Automatically charge me for parking at participating locations.
                <i className="fas fa-info-circle"></i>
              </label>
            </div>

            <button type="submit" className="update-btn">UPDATE</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile; 