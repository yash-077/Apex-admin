import axios from 'axios';

const api = axios.create({
  // Prefer an explicit env override. Default to a relative URL so requests
  // go to the same origin as the served frontend (avoids mixed-content errors).
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
});

// Request interceptor to attach the JWT admin token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    // Ensure headers object exists
    config.headers = config.headers || {};

    // Don't override Content-Type for FormData (let browser/axios set multipart boundaries)
    const isFormData = config.data && typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (!isFormData && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    if (token) {
      // Attach both header variations to be robust
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle API responses and keep the full structure
api.interceptors.response.use(
  (response) => {
    // Keep the full response structure for compatibility with admin hooks
    return response;
  },
  (error) => {
    // Network-level failures will have no response
    if (!error.response) {
      console.error('API network error:', error.message || error);
    }

    if (error.response?.status === 401) {
      // Clear token on 401 (unauthorized)
      localStorage.removeItem('admin_token');
      try {
        // Redirect to admin login to force re-authentication
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export default api;
