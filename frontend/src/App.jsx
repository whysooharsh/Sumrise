import axios from 'axios';

axios.defaults.withCredentials = true;
axios.interceptors.request.use(async config => {
    if (!axios.defaults.headers.common['CSRF-Token']) {
        try {
            const response = await axios.get('http://localhost:5000/api/csrf-token');
            axios.defaults.headers.common['CSRF-Token'] = response.data.csrfToken;
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
        }
    }
    return config;
}); 