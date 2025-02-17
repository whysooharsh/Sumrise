import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import Editor from "../Editor";

// some err in brave browser
// fixed using copilot

const resizeObserverLoopErr = () => {
  const resizeObserverErrDiv = document.createElement('div');
  resizeObserverErrDiv.id = 'resizeObserverErrDiv';
  resizeObserverErrDiv.style.display = 'none';
  document.body.appendChild(resizeObserverErrDiv);
  const resizeObserverErr = () => {
    const errDiv = document.getElementById('resizeObserverErrDiv');
    if (errDiv) {
      errDiv.innerHTML += 'ResizeObserver loop completed with undelivered notifications.<br>';
    }
  };
  window.addEventListener('error', (event) => {
    if (event.message === 'ResizeObserver loop completed with undelivered notifications') {
      event.stopImmediatePropagation();
      resizeObserverErr();
    }
  });
};

resizeObserverLoopErr();

export default function CreatePost() {
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const logCookies = () => {
    const cookies = document.cookie.split('; ');
    console.log("Cookies:", cookies);
  };

  const createPost = async (e) => {
    e.preventDefault();
    setStatus((s) => ({ ...s, error: "", loading: true }));
  
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("summary", post.summary);
    formData.append("content", post.content);
    if (post.file) formData.append("file", post.file);
  
    try {
    
      const response = await axios.post("http://localhost:5000/api/blogs", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          // Dont manually set the Authorization header here
          // boz token is already sent as an httpOnly cookie 
        },
      });
  
      console.log("Response:", response);
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
