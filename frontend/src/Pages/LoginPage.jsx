import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {UserContext} from "../UserContext.jsx";
import {api} from '../api';

export default function LoginPage() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  
  async function login(ev) {
    ev.preventDefault();
    try {
      const response = await api.post('/auth/login', {username, password});
      setUserInfo(response.data);
      setRedirect(true);
    } catch (error) {
      alert('Wrong credentials');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  
  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-medium mb-8 text-center">Sign in</h1>
      <form onSubmit={login} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={ev => setUsername(ev.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={ev => setPassword(ev.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
        />
        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Sign in
        </button>
      </form>
    </div>
  );
}
