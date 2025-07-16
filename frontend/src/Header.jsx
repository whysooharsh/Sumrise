import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "./UserContext.jsx";
import {api} from "./api";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  
  useEffect(() => {
    api.get('/auth/profile').then(response => {
      setUserInfo(response.data);
    }).catch(() => {
      setUserInfo(null);
    });
  }, [setUserInfo]);

  function logout() {
    api.post('/auth/logout').then(() => {
      setUserInfo(null);
    });
  }

  const username = userInfo?.username;

  return (
    <header className="flex justify-between items-center py-6 mb-8 border-b border-gray-200">
      <Link to="/" className="text-xl font-medium text-black">
        Surmise
      </Link>
      <nav className="flex gap-4">
        {username && (
          <>
            <Link to="/create" className="text-gray-600 hover:text-black">
              Write
            </Link>
            <button onClick={logout} className="text-gray-600 hover:text-black">
              Sign out
            </button>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="text-gray-600 hover:text-black">
              Sign in
            </Link>
            <Link to="/register" className="text-black">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
