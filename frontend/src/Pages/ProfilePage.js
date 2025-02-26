import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/blog/user-posts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };
    
    fetchUserPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userPosts.map(post => (
          <div key={post._id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.content.substring(0, 150)}...</p>
            <button 
              onClick={() => navigate(`/edit-post/${post._id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;