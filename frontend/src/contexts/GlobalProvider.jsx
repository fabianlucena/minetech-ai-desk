import { useState, useCallback, useMemo } from 'react';
import GlobalContext from './GlobalContext.jsx';

export default function GlobalProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState({});
  const [pendingNavigation, setPendingNavigation] = useState(null);

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
    pendingNavigation, setPendingNavigation,
    session, setSession, updateSession,
  }), [menuOpen, setMenuOpen, toggleMenuOpen,
      loading, setLoading,
      pendingNavigation, setPendingNavigation,
      session, setSession, updateSession]);

  return <GlobalContext.Provider value={value} >
    {children}
  </GlobalContext.Provider>;
}