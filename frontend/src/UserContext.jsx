import {createContext, useState, useEffect} from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [userInfo,setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize state after hydration to prevent SSR mismatch
  useEffect(() => {
    setLoading(false);
  }, []);

  // Don't render children until hydration is complete
  if (loading) {
    return null;
  }

  return (
    <UserContext.Provider value={{userInfo,setUserInfo}}>
      {children}
    </UserContext.Provider>
  );
}