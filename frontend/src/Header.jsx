import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function Header(){
    const {info, setInfo} = useContext(UserContext);

    useEffect(() => {
        axios.get('http://localhost:5000/profile', {
            withCredentials: true,
        }).then(response => {
            setInfo(response.data);
        }).catch(error => {
            console.log('Error fetching profile:', error);
        });
    }, []); 

    function logout(){
        axios.get('http://localhost:5000/logout',{
            withCredentials:true,
            method: 'POST',
        });
        setInfo(null);
    }

        const username = setInfo?.username;

    return (
        <header>
            <Link to="/" className="logo">Surmise</Link>
            <nav>
                {username && (
                    <>
                    <Link to="/create">Create New Post</Link>
                    <a onClick={logout}>Logout ({username})</a>
                    </>
                )}
                {!username && (
                    <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}