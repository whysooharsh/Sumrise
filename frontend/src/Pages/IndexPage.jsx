import { useEffect, useState } from 'react';
import Post from '../Post.jsx';
import { api } from '../api';

function PostSkeleton() {
  return (
    <article className="border-b border-gray-100 pb-8 mb-8 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 order-2 sm:order-1">
          <div className="h-7 bg-gray-200 rounded-md w-3/4 mb-3"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-200 rounded-md w-24"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-32"></div>
          </div>
        </div>
        <div className="w-full sm:w-32 md:w-40 h-48 sm:h-24 md:h-28 bg-gray-200 rounded-xl order-1 sm:order-2"></div>
      </div>
    </article>
  );
}

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts')
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-0">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

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