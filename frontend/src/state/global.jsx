import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState({});

  function toggleMenuOpen() {
    setMenuOpen(!menuOpen);
  }

  function updateSession(newSession) {
    setSession((prevSession) => ({
      ...prevSession,
      ...newSession,
    }));
  }

  return <GlobalContext.Provider
    value={{
      menuOpen, setMenuOpen, toggleMenuOpen,
      loading, setLoading,
      session, setSession, updateSession,
    }}
  >
    {children}
  </GlobalContext.Provider>;
}

export const useGlobal = () => useContext(GlobalContext);
