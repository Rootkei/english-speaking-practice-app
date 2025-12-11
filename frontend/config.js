// Application Configuration
const APP_CONFIG = {
    // Backend API Base URL
    // For local development: http://localhost:5000
    // For production: https://english-practice-api.info-vinhky.workers.dev
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://english-practice-api.info-vinhky.workers.dev'  // Replace with your Cloudflare Workers URL
};
