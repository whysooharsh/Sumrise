import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PostsContext } from "../PostsContext";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function IndexPage() {
  const { posts, setPosts } = useContext(PostsContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
          const res = await axios.get(`${API_BASE_URL}/api/blogs`, {
          withCredentials: true,
          headers: {
            "Authorization": `Bearer ${document.cookie.split('=')[1]}`,
          },
        });
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error.response ? error.response.data : error.message);
      }
    };
    fetchPosts();
  }, [setPosts]);

  return (
    <div className="index-page">
      <h1>All Posts</h1>
      <div style={{
        display : "flex",
        flexWrap : "wrap",
        gap : "20px",
        padding : "20px",
      }} className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card" style={{
              display: 'flex',
              gap: '20px',
              padding: '20px',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              margin: '10px 0',
              width: '100%'
            }}>
              <div style={{ flex: '1' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <p style={{ 
                    fontSize: '0.8rem', 
                    color: '#666'
                  }}>By {post.author.username}</p>
                  <time style={{ 
                    fontSize: '0.8rem', 
                    color: '#666'
                  }}>{new Date(post.createdAt).toLocaleDateString()}</time>
                </div>
                <h2 style={{ 
                  fontSize: '1.8rem',
                  marginBottom: '12px'
                }}>{post.title}</h2>
                <p style={{ 
                  color: '#444',
                  marginBottom: '15px'
                }}>{post.summary}</p>
                <Link to={`/post/${post._id}`}>Read More</Link>
              </div>
              <div style={{ 
                width: '300px', 
                height: '200px', 
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={post.cover ? `${API_BASE_URL}/${post.cover.replace(/\\/g, '/')}` : "https://res.cloudinary.com/dpwqggym0/image/upload/v1740162998/yg5ensxbj69mjlxsrvts.avif"}
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://res.cloudinary.com/dpwqggym0/image/upload/v1740162998/yg5ensxbj69mjlxsrvts.avif";
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}
