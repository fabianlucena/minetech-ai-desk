import useGlobal from './useGlobal.jsx';

const useSession = () => {
  const { session, updateSession, setSession, clearSession } = useGlobal();
  return { session, updateSession, setSession, clearSession };
}

export default useSession;