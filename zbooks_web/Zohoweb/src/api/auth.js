import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login/', credentials);
    // SimpleJWT returns { access, refresh }
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    // fetch user info
    const me = await api.get('/auth/me/');
    return { user: me.data, tokens: { access, refresh } };
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Login failed');
  }
};

export const registerUser = async (userData) => {
  try {
    // Backend Register accepts only user fields; organization will be added later
    const payload = {
      email: userData.email,
      full_name: userData.full_name,
      password: userData.password
    };
    await api.post('/auth/register/', payload);
    // Immediately login
    const loginRes = await loginUser({ email: userData.email, password: userData.password });
    return loginRes;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
};

export const refreshToken = async (refreshTokenValue) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
      refresh: refreshTokenValue
    });
    return response.data;
  } catch (error) {
    throw new Error('Token refresh failed');
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout/');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export default api;