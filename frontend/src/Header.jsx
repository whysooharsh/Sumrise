import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";  
import { UserContext } from "./UserContext";

export default function Header() {
    const location = useLocation();
    const { userInfo, setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();
    const [postId, setPostId] = useState(null);

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

    useEffect(() => {

        const match = location.pathname.match(/^\/post\/([a-fA-F0-9]{24})$/);
        if (match) {
            setPostId(match[1]);
        }
    }, [location]);

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
    function deletePost() {
        if (window.confirm('Are you sure you want to delete this post?')) {
            axios.delete(`http://localhost:5000/api/blogs/${postId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(() => {
                navigate('/');
            })
            .catch(error => {
                console.error('Error deleting post:', error);
                alert('Failed to delete post. Please try again.');
            });
        }
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to="/" className="logo">Sumrise</Link>
            <nav>
                {username ? (
                    <>
                        {location.pathname === "/" && (
                            <Link to="/create" className="create" ><button>Create New Post</button></Link>
                        )}
                        {location.pathname === "/" && (
                            <button onClick={logout} style={{ cursor: 'pointer' }}>Logout ({username})</button>
                        )}
                        {location.pathname.startsWith('/post/') && (
                            <button onClick={deletePost} style={{ cursor: 'pointer' }}>Delete Post</button>
                        )}
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
