import useGlobal from './useGlobal.jsx';

const useSession = () => {
  const { session, updateSession } = useGlobal();
  return { session, updateSession };
}

export default useSession;