import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, userService } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import '../styles/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      const token = response.data;

      localStorage.setItem('token', token);

      // 🔍 Décoder le token pour extraire l'ID utilisateur
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.id;

      if (userId) {
        localStorage.setItem('userId', userId);
      }

      navigate('/car-selection');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-header">
            <h1>Welcome Back!</h1>
            <p>Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="social-login">
              <p>Or sign in with</p>
              <div className="social-buttons">
                <button type="button" className="social-button google">
                  <i className="fab fa-google"></i>
                </button>
                <button type="button" className="social-button facebook">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button type="button" className="social-button apple">
                  <i className="fab fa-apple"></i>
                </button>
              </div>
            </div>

            <div className="register-link">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </div>
          </form>
        </div>

        <div className="login-right">
          <div className="login-image">
            <img
              src="/assets/parking-illustration.svg"
              alt="Parking Illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
