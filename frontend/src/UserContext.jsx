import {createContext, useState} from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [userInfo,setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <UserContext.Provider value={{userInfo, setUserInfo, loading, setLoading}}>
      {children}
    </UserContext.Provider>
  );
}