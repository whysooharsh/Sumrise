import React, { useEffect, useState } from 'react';
import { fetchData } from '../api';

const YourComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData('your-endpoint'); // Replace 'your-endpoint' with your actual endpoint
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);

  return (
    <div>
      {data ? (
        <div>{/* Render your data here */}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default YourComponent;
