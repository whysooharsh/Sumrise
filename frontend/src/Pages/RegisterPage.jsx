import {useState} from "react";
import {api} from '../api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  async function register(ev) {
    ev.preventDefault();
    try {
      await api.post('/auth/register', {username, password});
      alert('Registration successful');
    } catch (error) {
      alert('Registration failed');
    }
  }
  
  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-medium mb-8 text-center">Sign up</h1>
      <form onSubmit={register} className="space-y-4">
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
          Sign up
        </button>
      </form>
    </div>
  );
}
