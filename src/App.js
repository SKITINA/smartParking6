import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Map from './pages/Map';
import Location from './pages/Location';
import CarSelection from './pages/CarSelection';
import LicensePlateDetectionPage from './pages/LicensePlateDetectionPage';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './styles/App.css';

// Création du thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/map" element={<Map />} />
              <Route path="/location" element={isAuthenticated ? <Location /> : <Navigate to="/login" />} />
              <Route path="/car-selection" element={isAuthenticated ? <CarSelection /> : <Navigate to="/login" />} />
              <Route path="/license-plate-detection" element={isAuthenticated ? <LicensePlateDetectionPage /> : <Navigate to="/login" />} />
              <Route path="/booking" element={isAuthenticated ? <Booking /> : <Navigate to="/login" />} />
              <Route path="/payment" element={isAuthenticated ? <Payment /> : <Navigate to="/login" />} />
              <Route path="/confirmation" element={isAuthenticated ? <Confirmation /> : <Navigate to="/login" />} />
              <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
