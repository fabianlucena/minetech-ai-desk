import useGlobal from './useGlobal.jsx';

const useSession = () => {
  const { session, updateSession, setSession } = useGlobal();
  return { session, updateSession, setSession };
}

export default useSession;