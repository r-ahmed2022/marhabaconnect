
const API_BASE_URL =
 
    (import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://marhaba-backend.onrender.com');

export { API_BASE_URL };
