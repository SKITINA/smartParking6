import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Ajouter token JWT si disponible
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔐 Authentification
export const authService = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users', userData),
  logout: () => localStorage.removeItem('token'),
  getUserByEmail: (email) => api.get(`/users/email?email=${email}`),
};

// 👤 Utilisateur
export const userService = {
  getAll: (page = 0, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// 📍 Location
export const locationService = {
  getAll: (page = 1, limit = 10) => api.get(`/location?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/location/${id}`),
  create: (data) => api.post('/location', data),
  update: (id, data) => api.put(`/location/${id}`, data),
  delete: (id) => api.delete(`/location/${id}`),
};

// 🅿️ Parking
export const parkingService = {
  getAll: (page = 0, limit = 10) => api.get(`/parkings?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/parkings/${id}`),
  create: (data) => api.post('/parkings', data),
  update: (id, data) => api.put(`/parkings/${id}`, data),
  delete: (id) => api.delete(`/parkings/${id}`),
};

// 🚗 Places de parking
export const parkingSpotService = {
  getAll: (page = 0, limit = 10) => api.get(`/parkingspots?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/parkingspots/${id}`),
  create: (data) => api.post('/parkingspots', data),
  update: (id, data) => api.put(`/parkingspots/${id}`, data),
  delete: (id) => api.delete(`/parkingspots/${id}`),
};

// 📅 Réservations
export const reservationService = {
  create: (data) => api.post('/reservations', data),
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  getUserReservations: () => api.get('/reservations/user'),
  cancel: (id) => api.delete(`/reservations/${id}`),
  update: (id, data) => api.put(`/reservations/${id}`, data),
};

// 💳 Paiements généraux
export const paymentService = {
  create: (data) => api.post('/payments', data),
  getAll: (page = 0, limit = 10) => api.get(`/payments?page=${page}&limit=${limit}`),
  getById: (uuid) => api.get(`/payments/${uuid}`),
  update: (uuid, data) => api.put(`/payments/${uuid}`, data),
  delete: (uuid) => api.delete(`/payments/${uuid}`),
};

// 🏦 Paiement par virement
export const bankTransferService = {
  create: (data) => api.post('/bank-transfers', data),
  getById: (uuid) => api.get(`/bank-transfers/${uuid}`),
  update: (uuid, data) => api.put(`/bank-transfers/${uuid}`, data),
  delete: (uuid) => api.delete(`/bank-transfers/${uuid}`),
  getAll: (page = 0, limit = 10) => api.get(`/bank-transfers?page=${page}&limit=${limit}`),
};

// 💳 Paiement par carte
export const creditCardService = {
  create: (data) => api.post('/payments/credit-card', data),
  getById: (uuid) => api.get(`/payments/credit-card/${uuid}`),
  update: (uuid, data) => api.put(`/payments/credit-card/${uuid}`, data),
  delete: (uuid) => api.delete(`/payments/credit-card/${uuid}`),
  getAll: (page = 0, limit = 10) => api.get(`/payments/credit-card?page=${page}&limit=${limit}`),
};

// 🗣️ Feedback
export const feedbackService = {
  create: (data) => api.post('/feedback', data),
  getAll: (page = 1, limit = 10) => api.get(`/feedback?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/feedback/${id}`),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
};

// 📧 Contact support
export const contactService = {
  submit: (data) => api.post('/contactUs', data),
  getAll: (page = 1, limit = 10) => api.get(`/contactUs?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/contactUs/${id}`),
  update: (id, data) => api.put(`/contactUs/${id}`, data),
  delete: (id) => api.delete(`/contactUs/${id}`),
};// ✅ Bonne route correspondant au backend
export const licensePlateService = {
  recognize: (file) => {
    const formData = new FormData();
    formData.append('upload', file);

    return api.post('/plates/recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};



// 📊 Statistiques
export const statsService = {
  getDashboardStats: async () => {
    const response = await fetch('/api/stats/dashboard', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },
  getParkingStats: async (parkingId) => {
    const response = await fetch(`/api/stats/parking/${parkingId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },
};

// 📷 Images
export const imageService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/images/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return response.json();
  },
  getImageUrl: (imageId) => `/api/images/${imageId}`,
};

export default api;
