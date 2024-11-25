import axios from 'axios';

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

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken && !config.headers['X-CSRFToken']) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
