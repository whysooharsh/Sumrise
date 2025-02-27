import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://sumrise.onrender.com';
axios.interceptors.request.use(async config => {
    if (!axios.defaults.headers.common['CSRF-Token']) {
        try {
                const response = await axios.get(`${API_BASE_URL}/api/csrf-token`);
            axios.defaults.headers.common['CSRF-Token'] = response.data.csrfToken;
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
        }
    }
    return config;
}); 