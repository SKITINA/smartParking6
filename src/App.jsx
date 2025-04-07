import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User Pages
import HomePage from './pages/HomePage';
import DashboardUser from './pages/DashboardUser';
import EditProfile from './pages/EditProfile';
import CarSelectionPage from './pages/CarSelectionPage';
import ParkingListPage from './pages/ParkingListPage';
import ReservationPage from './pages/ReservationPage';
import MyReservationsPage from './pages/MyReservationsPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
// Smart Features
import LicensePlateDetectionPage from './pages/LicensePlateDetectionPage';
import DetectionResultPage from './pages/DetectionResultPage';

// Feedback & Support
import FeedbackPage from './pages/FeedbackPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';

// Information Pages
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';

import './styles/global.css';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={<DashboardUser />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/car-selection" element={<CarSelectionPage />} />
            <Route path="/parking-selection" element={<ParkingListPage />} />
            <Route path="/reservation/:parkingId" element={<ReservationPage />} />
            <Route path="/my-reservations" element={<MyReservationsPage />} />
            <Route path="/payment/:reservationId" element={<PaymentPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/license-plate-detection" element={<LicensePlateDetectionPage />} />


            
            <Route path="/detection-result" element={<DetectionResultPage />} />

            {/* Feedback */}
            <Route path="/feedback" element={<FeedbackPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 