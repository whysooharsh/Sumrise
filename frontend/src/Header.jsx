import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "./UserContext.jsx";
import {api} from "./api";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  
  useEffect(() => {
    // Add delay to prevent hydration issues
    const timer = setTimeout(() => {
      api.get('/auth/profile').then(response => {
        setUserInfo(response.data);
      }).catch(error => {
        console.log('Profile fetch failed:', error.response?.status || error.message);
        setUserInfo(null);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [setUserInfo]);

  function logout() {
    api.post('/auth/logout').then(() => {
      setUserInfo(null);
    });
  }

  const username = userInfo?.username;

  return (
    <header className="flex justify-between items-center py-8 mb-12 border-b border-gray-100">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
          Surmise
        </Link>
       
      </div>
      <nav className="flex items-center gap-6">
        {username && (
          <>
            <Link 
              to="/create" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Write
            </Link>
            <button 
              onClick={logout} 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Sign out
            </button>
          </>
        )}
        {!username && (
          <>
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Sign in
            </Link>
            <Link 
              to="/register" 
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 font-medium transition-colors duration-200"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
