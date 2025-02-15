import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function Header() {
    const { info, setInfo } = useContext(UserContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.get('http://localhost:5000/api/auth/profile', {
            withCredentials: true,
        }).then(response => {
            setInfo(response.data);
        }).catch(error => {
            console.log('Error fetching profile:', error);
        });
    }, []); 

    function logout() {
        axios.post('http://localhost:5000/api/auth/logout', {}, {
            withCredentials: true,
        }).then(() => {
            setInfo(null);
            navigate('/login'); 
        }).catch(error => {
            console.log('Error logging out:', error);
        });
    }

    const username = info?.username;

    return (
        <header>
            <Link to="/" className="logo">Surmise</Link>
            <nav>
                {username && (
                    <>
                        <Link to="/create">Create New Post</Link>
                        <Link to="/edit-post">Edit Post</Link>
                        <a onClick={logout} style={{ cursor: 'pointer' }}>Logout ({username})</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
            {username && (
                <button onClick={() => navigate('/create')} className="create-post-button">
                    Create Post
                </button>
            )}
        </header>
    );
}
