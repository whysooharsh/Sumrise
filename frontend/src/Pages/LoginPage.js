import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {UserContext} from "../UserContext";
import axios from 'axios';

export default function LoginPage() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', 
        {username, password},
        {
          headers: {'Content-Type':'application/json'},
          withCredentials: true,
        }
      );
      setUserInfo(response.data);
      setRedirect(true);
    } catch (error) {
      alert('wrong credentials');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button>Login</button>
    </form>
  );
}