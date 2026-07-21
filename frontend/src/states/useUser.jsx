import useGlobal from './useGlobal.jsx';

const useUser = () => {
  const { session } = useGlobal();
  return session?.user;
}

export default useUser;