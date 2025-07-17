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
    <div className="space-y-0">
      {posts.length > 0 && posts.map(post => (
        <Post {...post} key={post._id} />
      ))}
      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No posts yet</p>
          <p className="text-gray-400 text-sm mt-2">Be the first to share your thoughts</p>
        </div>
      )}
    </div>
  );
}