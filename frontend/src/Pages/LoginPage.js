import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import './LoginPage.css';
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


axios.defaults.withCredentials = true;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      const data = await response.data;
      
      if (response.status === 200) {
        setUserInfo(data.user || data);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          setRedirect(true);
        }, 1000); // Redirect after 1 second
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (e) {
      console.error('Login error:', e);
      if (e.response) {
        setError(e.response.data.message || 'Login failed');
      } else if (e.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

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
        {success && <div className="success-message" style={{color: 'green'}}>{success}</div>}
        <form className="login" onSubmit={login}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={ev => setUsername(ev.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}