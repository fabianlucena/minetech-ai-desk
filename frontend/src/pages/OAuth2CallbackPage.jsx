import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { oAuth2Callback } from '../services/oauth2provider.service.js';
import { ErrorDialog } from '../components/dialogs';
import useToast from '../contexts/useToast';
import useGlobal from '../contexts/useGlobal.jsx';
import useLogin from '../services/useLogin';

let oauth2AutorizationRequested = false;
function setOauth2AutorizationRequested(value) {
  oauth2AutorizationRequested = value;
  if (value) {
    setTimeout(() => {
      oauth2AutorizationRequested = false;
    }, 3000); // Reset after 10 seconds to allow new authorization attempts
  }
}

export default function OAuth2CallbackPage() {
  const { name, action } = useParams();
  const [errorMessage, setErrorMessage] = useState();
  const [errorTitle, setErrorTitle] = useState();
  const [message, setMessage] = useState('Autorizando...');
  const navigate = useNavigate();
  const { updateSession } = useGlobal();
  const { addMessage, addError } = useToast();
  const { setCredentials, clearCredentials } = useLogin();

  // oxlint-disable-next-line react-hooks/exhaustive-deps
  const goHome = useCallback(() => { navigate('/'); }, []);

  useEffect(() => {
    if (oauth2AutorizationRequested) {
      console.log('OAuth2 authorization already requested, waiting for response...');
      setMessage('Ya hay una autorización en curso. Espere un momento y vuelva a intentarlo si no se completa.');
      return;
    }
    setOauth2AutorizationRequested(true);
    console.log(`Handling OAuth2 callback for provider: ${name}, action: ${action}`);
    let search = window.location.search;
    let deviceToken = localStorage.getItem('deviceToken');
    if (deviceToken)
      search += (search ? '&' : '?') + `deviceToken=${deviceToken}`;

    oAuth2Callback(name, action, search)
      .then(res => {
        updateSession({
          user: res?.user ?? null,
          roles: res?.roles ?? null,
          permissions: res?.permissions ?? null,
        });
        setCredentials(res);
        setErrorMessage(null); 
        setErrorTitle(null);
        setMessage('Autorizado correctamente. Redirigiendo...');
        addMessage('Autorizado correctamente');
        goHome();
      })
      .catch(({ data, res, error }) => {
        clearCredentials();
        updateSession({
          user: null,
          roles: null,
          permissions: null,
        });
        const message = data?.message || data?.error || res?.statusText || error?.message || error?.error || 'Error desconocido';
        setErrorMessage(message); 
        setErrorTitle('Error al autorizar');
        setMessage('Error al autorizar. Por favor, inténtelo de nuevo.');
        addError('Error al autorizar: ' + message);
      });
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [name, action, updateSession, goHome, addMessage, addError]);

  return <>
    <ErrorDialog title={errorTitle}>
      {errorMessage}
    </ErrorDialog>
    {message}
  </>
}
