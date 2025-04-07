import { useState, useEffect } from 'react';
import { 
  parkingService, 
  userService, 
  statsService, 
  reservationService 
} from '../services/api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalParkings: 0,
    totalRevenue: 0,
    occupancyRate: 0
  });
  const [parkings, setParkings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        statsResponse,
        parkingsResponse,
        usersResponse,
        reservationsResponse
      ] = await Promise.all([
        statsService.getOverview(),
        parkingService.getAll(),
        userService.getAll(),
        reservationService.getAll()
      ]);

      setStats(statsResponse.data);
      setParkings(parkingsResponse.data);
      setUsers(usersResponse.data);
      setReservations(reservationsResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParking = async (parkingId) => {
    if (window.confirm('Are you sure you want to delete this parking?')) {
      try {
        await parkingService.delete(parkingId);
        setParkings(parkings.filter(p => p.id !== parkingId));
      } catch (err) {
        setError('Failed to delete parking');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'parkings' ? 'active' : ''}`}
            onClick={() => setActiveTab('parkings')}
          >
            Parkings
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            Reservations
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="dashboard-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Parkings</h3>
              <p className="stat-value">{stats.totalParkings}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-value">${stats.totalRevenue}</p>
            </div>
            <div className="stat-card">
              <h3>Occupancy Rate</h3>
              <p className="stat-value">{stats.occupancyRate}%</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'parkings' && (
        <div className="parkings-management">
          <div className="section-header">
            <h2>Parkings Management</h2>
            <button className="add-button">Add New Parking</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Total Spots</th>
                  <th>Available Spots</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {parkings.map(parking => (
                  <tr key={parking.id}>
                    <td>{parking.id}</td>
                    <td>{parking.name}</td>
                    <td>{parking.location}</td>
                    <td>{parking.totalSpots}</td>
                    <td>{parking.availableSpots}</td>
                    <td>
                      <button className="edit-button">Edit</button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteParking(parking.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-management">
          <h2>Users Management</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstname} {user.surname}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className="edit-button">Edit</button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="reservations-management">
          <h2>Reservations</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Parking Spot</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation.id}>
                    <td>{reservation.id}</td>
                    <td>{reservation.user.email}</td>
                    <td>{reservation.parkingSpot.name}</td>
                    <td>{new Date(reservation.dateParking).toLocaleDateString()}</td>
                    <td>{reservation.duration} hours</td>
                    <td>
                      <span className={`status ${reservation.status.toLowerCase()}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td>${reservation.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 