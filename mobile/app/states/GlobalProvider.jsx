import { useState, useCallback, useMemo } from 'react';
import GlobalContext from './GlobalContext.jsx';
import { setCredentials } from '../services/login.service.js';

export default function GlobalProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState({});

  const updateSession = useCallback((newSession) => {
    setSession((prevSession) => ({
      ...prevSession,
      ...newSession,
    }));
    setCredentials(newSession);
  }, []);

  const value = useMemo(() => ({
    loading, setLoading,
    session, setSession, updateSession,
  }), [loading, setLoading,
      session, setSession, updateSession]);

  return <GlobalContext.Provider value={value} >
    {children}
  </GlobalContext.Provider>;
}