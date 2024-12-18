import { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const logUser = (loggedUser) => {
    setUser(loggedUser);
  }
  useEffect(() => {
    if (user) {
      localStorage.setItem("loggedUser", user);
      localStorage.setItem("loggedUserID", userID);
    }
  }, [user, userID])

  useEffect(() => {
    const logged = localStorage.getItem("loggedUser");
    const loggedID = localStorage.getItem("loggedUserID");
    setUser(logged)
    setUserID(loggedID)
  }, [])

  return (
    <RoleContext.Provider value={{ userID, user, logUser, setUserID }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
