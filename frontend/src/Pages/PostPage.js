import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";  
import DOMpurify from 'dompurify';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function PostPage() {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError("Failed to load post.");
      }
      finally{
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-page" 
    style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        width: "100%"
    }}>
      <h1
      style={{
          fontSize: "3rem",
          fontWeight: "bold",
          fontFamily: "Helvetica Neue, Helvetica, Arial",
          padding: "20px",
          color: "#333",
          textAlign: "center",
          margin: "20px 0",
          lineHeight: "1.2"
      }}
      ><span style={{
          background: 'black',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
      }}>{post.title}</span></h1>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '30px'
      }}>
        {post.author && <span>By {post.author.username}</span>}
        {post.createdAt && (
          <span>• {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        )}
      </div>

      <p style={{
        fontSize: '1.2rem',
        lineHeight: '1.6',
        color: '#555',
        marginBottom: '30px',
        fontStyle: 'italic',
        textAlign: 'center'
      }}>{post.summary}</p>

      {post.cover && (
        <img 
          src={`http://localhost:5000/${post.cover}`} 
          alt={post.title}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '600px',
            objectFit: 'contain',
            borderRadius: '12px',
            marginBottom: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backgroundColor: '#f8f8f8'
          }}
        />
      )}

      <div 
        dangerouslySetInnerHTML={{ __html: DOMpurify.sanitize(post.content) }}
        style={{
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: '#2c3e50',
          '& h2': {
            fontSize: '1.8rem',
            marginTop: '40px',
            marginBottom: '20px',
            color: '#2c3e50'
          },
          '& p': {
            marginBottom: '20px'
          },
          '& img': {
            maxWidth: '100%',
            borderRadius: '8px',
            marginTop: '20px',
            marginBottom: '20px'
          },
          '& blockquote': {
            borderLeft: '4px solid #4ECDC4',
            paddingLeft: '20px',
            margin: '20px 0',
            fontStyle: 'italic',
            color: '#666'
          }
        }}
        className="content"
      />

      <hr style={{
        border: 'none',
        height: '1px',
        background: 'linear-gradient(to right, transparent, #333, transparent)',
        margin: '40px 0'
      }} />

      <footer style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px 0',
        color: '#666'
      }}>
        <div style={{
          display: 'flex',
          gap: '20px'
        }}>
          <a href="https://twitter.com/whysooharsh" 
             target="_blank" 
             rel="noopener noreferrer"
             style={{ color: '#1DA1F2', fontSize: '24px' }}>
            <FaTwitter />
          </a>
          <a href="https://linkedin.com/in/harsharma45" 
             target="_blank" 
             rel="noopener noreferrer"
             style={{ color: '#0077B5', fontSize: '24px' }}>
            <FaLinkedin />
          </a>
        </div>
        <p style={{ fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} {post.author.username}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
