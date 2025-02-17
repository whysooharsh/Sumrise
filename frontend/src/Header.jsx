import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!userInfo) {
            axios.get('http://localhost:5000/api/auth/profile', {
                withCredentials: true,
            }).then(response => {
                setUserInfo(response.data);
            }).catch(error => {
                console.log('Error fetching profile:', error);
            });
        }
    }, [setUserInfo, userInfo]);

    function logout() {
        axios.post('http://localhost:5000/api/auth/logout', {}, {
            withCredentials: true,
        })
        .then(() => {
            setUserInfo(null);
            navigate('/login');
        })
        .catch(error => {
            console.log('Error logging out:', error);
            setUserInfo(null);
            navigate('/login');
        });
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to="/" className="logo">Sumrise</Link>
            <nav>
                {username ? (
                    <>
                        <Link to="/create" className="create" >Create New Post</Link>
                        <button onClick={logout} style={{ cursor: 'pointer' }}>Logout ({username})</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
            
        </header>
    );
}
