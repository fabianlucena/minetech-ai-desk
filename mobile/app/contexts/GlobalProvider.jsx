import { useState, useCallback, useMemo } from 'react';
import GlobalContext from './GlobalContext.jsx';

export default function GlobalProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState({});

  const updateSession = useCallback((newSession) => {
    setSession((prevSession) => ({
      ...prevSession,
      ...newSession,
    }));
  }, []);

  const clearSession = useCallback(() => {
    setSession({});
  }, []);

  const value = useMemo(() => ({
    loading, setLoading,
    session, setSession, updateSession, clearSession,
  }), [loading, setLoading,
      session, setSession, updateSession, clearSession]);

  return <GlobalContext.Provider value={value} >
    {children}
  </GlobalContext.Provider>;
}