import { useEffect, useState } from 'react';
import Post from '../Post.jsx';
import { api } from '../api';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts').then(response => {
      setPosts(response.data);
    });
  }, []);

  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post {...post} key={post._id} />
      ))}
      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No posts yet</p>
        </div>
      )}
    </>
  );
}