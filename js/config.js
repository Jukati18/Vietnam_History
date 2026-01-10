// API Configuration for Frontend
// This file automatically detects if running locally or in production

const config = {
  // Detect environment
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  
  // API Base URL - will be set based on environment
  getApiUrl: function() {
    if (this.isDevelopment) {
      // Local development
      return 'http://localhost:3000/api';
    } else {
      // Production - replace with your Render URL after deployment
      return 'https://vietnamese-history-api-dvwf.onrender.com'
    }
  }
};

// Export API_BASE_URL for use in other files
const API_BASE_URL = config.getApiUrl();

// Log current configuration (helpful for debugging)
console.log('🌍 Environment:', config.isDevelopment ? 'Development' : 'Production');
console.log('🔗 API URL:', API_BASE_URL);