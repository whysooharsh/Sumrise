useEffect(() => {
  fetch('http://localhost:5000/your-endpoint')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    });
}, []); 