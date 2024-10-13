import { Form } from "react-router-dom";
import './LoginPage.css'

export default function RegisterPage(){
    return (
        <div className="container">
        <div className = "heading">
           <h4>Register</h4>
        </div>

        <div className="para">
        Enter your email address to create an account.
        </div>
        <div className="input">
        <form>
           <input type="text" placeholder="Username" class="input-field"/>
           <input type="password" placeholder="Password" class="input-field"/>
           <button>Continue</button>

        </form>
        </div>
        </div>
    )
}