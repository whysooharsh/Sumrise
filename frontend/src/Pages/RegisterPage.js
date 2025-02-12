import { Form } from "react-router-dom";
import './LoginPage.css'
import { useState } from "react";
import axios from "axios"

export default function RegisterPage(){
    const [Username,setUsername] = useState('');
    const [Password,setPassword] = useState('');
    const [error, setError] = useState('');

    async function register(ev){
        ev.preventDefault();
        setError('');
        
        // Basic validation
        if (!Username || !Password) {
            setError('Username and password are required');
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register',{
                username:Username,password:Password
            });
            
            if (response.data) {

                window.location.href = '/login';
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    }
    return (
        <div className="container">
        <div className = "heading">
           <h4>Register</h4>
        </div>

        <div className="para">
        Enter your email address to create an account.
        </div>
        <div className="input">
            {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
            <form className="register" onSubmit={register}>
           <input type="text"
            placeholder="Username"
            class="input-field"
            value={Username} 
            onChange={ev => setUsername(ev.target.value)}/>
           <input type="password"
            placeholder="Password"
            class="input-field"
            value={Password} 
            onChange={ev => setPassword(ev.target.value)}/>
           <button>Continue</button>

        </form>
        </div>
        </div>
    )
}