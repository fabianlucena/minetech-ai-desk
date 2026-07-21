import useGlobal from './useGlobal.jsx';

const usePermissions = () => {
  const { session } = useGlobal();
  return {
    permissions: session?.permissions || [],
    hasPermission: (permission) => session?.permissions?.includes(permission),
  };
}

export default usePermissions;