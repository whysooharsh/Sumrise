import { useState } from 'react';
import axios from 'axios';
import { Form } from "react-router-dom";
import './LoginPage.css'

export default function LoginPage(){
    const [Username,setUsername] = useState('');
    const [Password,setPassword] = useState('');
    async function login(ev){
        ev.preventDefault();
        await axios.post('http://localhost:5000/api/auth/login',{
            username:Username,password:Password
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <div className="container">
        <div className = "heading">
           <h4>Sign in with email</h4>
        </div>

        <div className="para">
            Enter the email and password associated with your account
        </div>
        <div className="input">
        <form action = "" onSubmit={login}>
           <input type="text" placeholder="Username" class="input-field" value={Username} onChange={ev => setUsername(ev.target.value)}/>
           <input type="password" placeholder="Password" class="input-field" value={Password} onChange={ev => setPassword(ev.target.value)}/>
           <button>Login</button>

        </form>
        </div>
        </div>
    )
}