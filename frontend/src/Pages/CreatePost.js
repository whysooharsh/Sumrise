import { useState, useContext, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import Editor from "../Editor";
import { UserContext } from "../UserContext";
import api from '../api';

export default function CreatePost() {
  const { userInfo } = useContext(UserContext);
  const [post, setPost] = useState({
    title: "",
    summary: "",
    content: "",
    file: null,
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    redirect: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const validateInput = () => {
    if (!post.title || !post.summary || !post.content) {
      setStatus((s) => ({ ...s, error: "All fields are required." }));
      return false;
    }
    return true;
  };

  const createPost = async (e) => {
    e.preventDefault();
    setStatus((s) => ({ ...s, error: "", loading: true }));

    if (!validateInput()) return;

    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("summary", post.summary);
    formData.append("content", post.content);
    if (post.file) formData.append("file", post.file);

    try {
      const response = await api.post('/api/blogs/post', formData);
      if (response.status === 201) {
        setStatus((s) => ({ ...s, redirect: true }));
      }
    } catch (err) {
      console.error("Error:", err);
      setStatus((s) => ({
        ...s,
        loading: false,
        error: err.response?.data?.message || err.message || "Failed to create post.",
      }));
    }
  };

  if (status.redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={createPost}>
      <h2>Create Post</h2>
      {status.error && <div className="error">{status.error}</div>}
      {status.loading && <div className="loading">Loading...</div>}

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={post.title}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="summary"
        placeholder="Summary"
        value={post.summary}
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="file"
        onChange={handleChange}
      />
      <Editor onChange={(value) => setPost({ ...post, content: value })} value={post.content} />
      <button type="submit" disabled={status.loading} style={{ marginTop: "5px" }}>
        {status.loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
