// Application Configuration
const APP_CONFIG = {
    // Backend API Base URL
    // For local development: https://english-practice-api.info-vinhky.workers.dev
    // For production: https://english-practice-api.info-vinhky.workers.dev
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'https://english-practice-api.info-vinhky.workers.dev'
        : 'https://english-practice-api.info-vinhky.workers.dev'  // Replace with your Cloudflare Workers URL
};
