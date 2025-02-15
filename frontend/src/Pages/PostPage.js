import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    cover: null,
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const validateInput = () => {
    if (!formData.title || !formData.summary || !formData.content) {
      setStatus({ ...status, error: "All fields are required." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ...status, error: "", success: "" });

    if (!validateInput()) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("summary", formData.summary);
    data.append("content", formData.content);
    if (formData.cover) data.append("cover", formData.cover);

    setStatus({ ...status, loading: true });

    try {
      const token = userInfo?.token;
      if (!token) {
        setStatus({ loading: false, error: "You must be logged in to create a post." });
        return;
      }

      const response = await axios.post("http://localhost:5000/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // noobie to write logic, 4o helped

      setStatus({ loading: false, success: "Post created successfully!" });

      setTimeout(() => {
        navigate(`/post/${response.data._id}`);
      }, 1500);
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.message || "Failed to create post.",
      });
    }
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      {status.error && <div className="error">{status.error}</div>}
      {status.success && <div className="success">{status.success}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="summary"
          placeholder="Summary"
          value={formData.summary}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="file"
          name="cover"
          onChange={handleChange}
        />
        <button type="submit" disabled={status.loading}>
          {status.loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
