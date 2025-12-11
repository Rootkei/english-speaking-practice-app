// Application Configuration
const APP_CONFIG = {
    // Backend API Base URL
    // For local development: https://english-speaking-practice-app.onrender.com
    // For production: https://english-speaking-practice-app.onrender.com
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'https://english-speaking-practice-app.onrender.com'
        : 'https://english-speaking-practice-app.onrender.com'  // Replace with your Cloudflare Workers URL
};
