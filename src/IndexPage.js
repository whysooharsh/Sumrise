import { BASE_URL } from './config';

useEffect(() => {
  fetch(`${BASE_URL}/post`)
    .then(response => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
    });
}, []); 