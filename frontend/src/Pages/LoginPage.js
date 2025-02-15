import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

export default function LoginPage() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Add success state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Reset success message

    try {
      console.log("Request Payload:", user); // Debugging line
      const response = await axios.post("http://localhost:5000/api/auth/login", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response); // Debugging line
      if (response.status === 200) {
        setSuccess("Login successful! Redirecting to home..."); // Set success message
        setTimeout(() => {
          navigate("/");
        }, 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      console.error("Error Response:", err.response); // Debugging line
      setError(err.response?.data?.message || "Failed to login.");
    }
  };

  return (
    <div className="container">
      <div className="heading">
        <h4>Login</h4>
      </div>
      <div className="para">
        Enter your credentials to login.
      </div>
      <div className="input">
        {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
        {success && <div className="success-message" style={{color: 'green'}}>{success}</div>} {}
        <form className="login" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input-field"
            value={user.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={user.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}