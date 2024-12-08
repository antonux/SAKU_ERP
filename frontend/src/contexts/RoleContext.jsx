import { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const logUser = (loggedUser) => {
    if (loggedUser == "admin" || loggedUser == "store" || loggedUser == "warehouse") {
      setUser(loggedUser);
    }
  }
  useEffect(() => {
    if (user) {
      localStorage.setItem("loggedUser", user);
    }
  }, [user])

  useEffect(() => {
    const logged = localStorage.getItem("loggedUser");
    setUser(logged)
  }, [])

  return (
    <RoleContext.Provider value={{ user, logUser }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
