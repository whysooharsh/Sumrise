import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function RegisterPage() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess(""); 

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username: user.username,
        password: user.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        setSuccess("Registration successful! Redirecting to login..."); 
        setTimeout(() => {
          navigate("/login");
        }, 1000); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register.");
    }
  };

  return (
    <div className="container">
      <div className="heading">
        <h4>Register</h4>
      </div>
      <div className="para">
        Enter your username to create an account.
      </div>
      <div className="input">
        {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
        {success && <div className="success-message" style={{color: 'green'}}>{success}</div>} {/* Display success message */}
        <form className="register" onSubmit={handleSubmit}>
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
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}