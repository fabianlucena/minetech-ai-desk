import { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

const initialState = {
  menuOpen: true,
  loading: false,
};

export function SessionProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  function toggleMenuOpen() {
    setMenuOpen(!menuOpen);
  }

  return <SessionContext.Provider
    value={{
      menuOpen, setMenuOpen, toggleMenuOpen,
      loading, setLoading,
    }}
  >
    {children}
  </SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
