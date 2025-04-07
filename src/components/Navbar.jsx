import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId && token.split('.').length === 3) {
      userService.getById(userId)
        .then((res) => setUser(res.data))
        .catch((err) => console.error('Erreur user:', err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Smart Parking</Link>

        <div className="navbar-links">
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/help">Help</Link>
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-dropdown">
              <button
                className="dropdown-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src="/assets/avatar.png"
                  alt="avatar"
                  className="user-avatar"
                />
                <span>{user.username || user.firstname}</span>
                <FaChevronDown size={12} style={{ marginLeft: 6 }} />
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile">View Profile</Link>
                  <Link to="/settings">Settings</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">Login</Link>
              <Link to="/register" className="signup-button">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
