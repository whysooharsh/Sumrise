import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Editor from "../Editor";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export default function EditPost() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchPost = async () => {
      setStatus((s) => ({ ...s, loading: true }));
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
        setPost({
          title: response.data.title,
          summary: response.data.summary,
          content: response.data.content,
          file: null,
        });
        setStatus((s) => ({ ...s, loading: false }));
      } catch (err) {
        setStatus((s) => ({
          ...s,
          loading: false,
          error: "Failed to fetch post details.",
        }));
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const updatePost = async (e) => {
    e.preventDefault();
    setStatus((s) => ({ ...s, error: "", loading: true }));

    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("summary", post.summary);
    formData.append("content", post.content);
    formData.append("id", id);
    if (post.file) formData.append("file", post.file);

    try {
      const response = await axios.put(`${API_BASE_URL}/api/post/$  {id}`, formData, {
        withCredentials: true,
        headers: {
          
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setStatus((s) => ({ ...s, redirect: true }));
      }
    } catch (err) {
      setStatus((s) => ({
        ...s,
        loading: false,
        error: err.response?.data?.message || "Failed to update post.",
      }));
    }
  };

  if (status.redirect) {
    return <Navigate to={`/posts/${id}`} />;
  }

  return (
    <form onSubmit={updatePost}>
      <h2>Edit Post</h2>
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
        {status.loading ? "Updating..." : "Update Post"}
      </button>
    </form>
  );
}
