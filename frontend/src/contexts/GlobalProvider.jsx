import { useState, useCallback, useMemo } from 'react';
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

  const value = useMemo(() => ({
    menuOpen, setMenuOpen, toggleMenuOpen,
    loading, setLoading,
    session, setSession, updateSession,
  }), [menuOpen, setMenuOpen, toggleMenuOpen,
      loading, setLoading,
      session, setSession, updateSession]);

  return <GlobalContext.Provider value={value} >
    {children}
  </GlobalContext.Provider>;
}