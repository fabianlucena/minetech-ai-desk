import { useState, useCallback } from 'react';
import GlobalContext from './GlobalContext.jsx';

export default function GlobalProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState({});

  const toggleMenuOpen = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  const updateSession = useCallback((newSession) => {
    setSession((prevSession) => ({
      ...prevSession,
      ...newSession,
    }));
  }, []);

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