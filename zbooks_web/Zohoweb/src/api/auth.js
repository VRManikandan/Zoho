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
    // Standardized payload structure matching backend expectations
    const payload = {
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name || userData.company_name || "",
      company_name: userData.company_name || userData.organization_name || "",
      phone_cc: userData.phone_cc || "+91",
      phone: userData.phone || "",
      country: userData.country || "India",
      state: userData.state || "Tamil Nadu",
    };

    await api.post('/auth/register/', payload);

    // Immediately login
    const loginRes = await loginUser({ email: userData.email, password: userData.password });
    return loginRes;
  } catch (error) {
    // Better error handling
    const errorData = error.response?.data;
    let errorMessage = 'Registration failed';
    
    if (typeof errorData === 'object' && errorData) {
      // Handle field-specific errors
      const fieldErrors = [];
      Object.entries(errorData).forEach(([field, errors]) => {
        if (Array.isArray(errors)) {
          fieldErrors.push(`${field}: ${errors.join(', ')}`);
        } else if (typeof errors === 'string') {
          fieldErrors.push(`${field}: ${errors}`);
        }
      });
      
      if (fieldErrors.length > 0) {
        errorMessage = fieldErrors.join('; ');
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } else if (typeof errorData === 'string') {
      errorMessage = errorData;
    }
    
    throw new Error(errorMessage);
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
    const refreshToken = localStorage.getItem('refresh_token');
    await api.post('/auth/logout/', { refresh_token: refreshToken });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const switchOrganization = async (organizationId) => {
  try {
    const response = await api.post('/auth/switch-organization/', {
      organization_id: organizationId
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to switch organization');
  }
};

export default api;