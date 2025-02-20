import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";  
import DOMpurify from 'dompurify';

export default function PostPage() {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError("Failed to load post.");
      }
    };

    fetchPost();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-page">
      <h1>{post.title}</h1>
      <p>{post.summary}</p>
      {post.cover && (
        <img 
          src={`http://localhost:5000/${post.cover}`} 
          alt="Cover" 
        />
      )}
      <div 
        dangerouslySetInnerHTML={{ __html: DOMpurify.sanitize(post.content) }}
        className="content"
      />
    </div>
  );
}
