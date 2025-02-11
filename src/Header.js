import { Link } from 'react-router-dom';
import { BASE_URL } from './config';
import { useEffect } from 'react';

const Header = () => {
  const handleClick = () => {
    // Handle click event
  };

  useEffect(() => {
    fetch(`${BASE_URL}/profile`, {
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  return (
    <div>
      {/* If you want to use an anchor tag, add href: */}
      <a href="#" onClick={handleClick}>Link text</a>

      {/* Or better, use Link from react-router-dom: */}
      <Link to="/path">Link text</Link>

      {/* Or if it's actually a button: */}
      <button onClick={handleClick}>Button text</button>
    </div>
  );
};

export default Header; 