import { useEffect, useState } from 'react';
import { BASE_URL } from '../config';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/post`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Server response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Posts received:', data); // Debug log
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post._id} className="post">
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            {/* Add other post details */}
          </div>
        ))
      ) : (
        <div>No posts found</div>
      )}
    </>
  );
} 