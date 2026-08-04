import { useEffect } from 'react';
import useGlobal from './states/useGlobal';
import { autoLoginService } from './services/login.service.js';
import Api from './utils/api.js';

import InitiatingScreen from './screens/InitiatingScreen';
import Router from './Router';

export default function Main() {
  const { loading, updateSession, setLoading } = useGlobal();

  useEffect(() => {
    if (Api.authorizationToken) {
      setLoading(false);
      return;
    }

    autoLoginService()
      .then(res => updateSession(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <InitiatingScreen />;

  return <Router />;
}