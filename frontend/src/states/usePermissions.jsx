import { useMemo } from 'react';
import useGlobal from './useGlobal.jsx';

const usePermissions = () => {
  const { session } = useGlobal();

  return useMemo(() => {
    const permissions = session?.permissions || [];

    return {
      permissions,
      hasPermission: (permission) => permissions.includes(permission),
    };
  }, [session?.permissions]);
}

export default usePermissions;