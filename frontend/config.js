// Application Configuration
const APP_CONFIG = {
    // Backend API Base URL
    // For local development: http://localhost:5000
    // For production: https://your-worker.workers.dev
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:5000'
        : 'https://your-worker.workers.dev'  // Replace with your Cloudflare Workers URL
};
