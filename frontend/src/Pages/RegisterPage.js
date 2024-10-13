import { Form } from "react-router-dom";
import './LoginPage.css'
import { useState } from "react";

export default function RegisterPage(){
    const [Username,setUsername] = useState('');
    const [Password,setPassword] = useState('');
    async function register(ev){
        ev.preventDefault();
        await fetch('http://localhost:4000/register',{
            method: 'Post',
            body: JSON.stringify({Username,Password}),

        })
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