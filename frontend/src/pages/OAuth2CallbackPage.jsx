import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { oAuth2Callback } from '../services/oauth2provider.service.js';
import { setCredentials, clearCredentials } from '../services/login.service.js';
import { ErrorDialog } from '../components/dialogs';
import useToast from '../states/useToast.jsx';
import useGlobal from '../states/useGlobal.jsx';

export default function OAuth2CallbackPage() {
  const { name, action } = useParams();
  const [errorMessage, setErrorMessage] = useState();
  const [errorTitle, setErrorTitle] = useState();
  const [message, setMessage] = useState('Autorizando...');
  const navigate = useNavigate();
  const { updateSession } = useGlobal();
  const { addMessage } = useToast();

  useEffect(() => {
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
        navigate('/');
      })
      .catch(({ data, res, error }) => {
        clearCredentials();
        updateSession({
          user: null,
          roles: null,
          permissions: null,
        });
        const message = data?.message || res?.statusText || error?.message || 'Error desconocido';
        setErrorMessage(message); 
        setErrorTitle('Error al autorizar');
        setMessage('Error al autorizar. Por favor, inténtelo de nuevo.');
        addMessage('Error al autorizar: ' + message);
      });
  }, [name, action, updateSession, navigate, addMessage]);

  return <>
    <ErrorDialog title={errorTitle}>
      {errorMessage}
    </ErrorDialog>
    {message}
  </>
}
