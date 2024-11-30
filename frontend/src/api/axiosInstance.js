import axios from 'axios';

// Function to retrieve the CSRF token from cookies
function getCSRFToken() {
  let csrfToken = null;
  if (document.cookie && document.cookie !== '') {
    document.cookie.split(';').forEach((cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrftoken') {
        csrfToken = decodeURIComponent(value);
      }
    });
  }
  return csrfToken;
}

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://saerek.pythonanywhere.com', // Replace with your backend URL
  withCredentials: true, // Ensures cookies are sent with requests
});

// Attach CSRF token and access token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken && !config.headers['X-CSRFToken']) {
      config.headers['X-CSRFToken'] = csrfToken; // Attach CSRF token
    }

    // Optionally include Authorization header if required
    const accessToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];

    if (accessToken && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and automatically refresh tokens if expired
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // If error is due to token expiration and not already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the token refresh endpoint
        const refreshResponse = await axiosInstance.post('/api/token/refresh/');
        console.log('Token refreshed successfully');

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Clear cookies and redirect to login on failure
        document.cookie = 'access_token=; Max-Age=0; path=/;';
        document.cookie = 'refresh_token=; Max-Age=0; path=/;';
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    }

    // If not a 401 error or refresh fails, reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
