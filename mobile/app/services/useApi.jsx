import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wsUrl, reconnectDelays, pingTimeout, pongTimeout } from '../../config';

export const ApiContext = createContext();

let validSocket = null;

let pingTimer;
let pongTimer = null;

function startHeartbeat(ws) {
  pingTimer = setInterval(() => {
    ws.send(JSON.stringify({ type: 'ping' }));

    pongTimer = setTimeout(() => {
      ws.close();
    }, pongTimeout);

  }, pingTimeout);
}

function stopHeartbeat() {
  clearInterval(pingTimer);
  clearTimeout(pongTimer);
}

function openIADeskSocket(
  authorizationToken,
  {
    debug,
    onOpen,
    onClose,
    onError,
    handler,
  }
) {
  console.log('Opening WebSocket connection to IA Desk...');

  const ws = new WebSocket(wsUrl + `/ia-desk`);
  validSocket = ws;

  ws.onopen = () => {
    if (validSocket !== ws)
      return;

    console.log('WebSocket connection to IA Desk opened, sending auth token...');
    ws.send(JSON.stringify({
      type: 'auth',
      token: authorizationToken
    }));

    onOpen?.();
  };

  ws.onmessage = (event) => {
    if (validSocket !== ws)
      return;

    if (debug)
      console.log('WebSocket message from IA Desk:', event.data);

    const msg = JSON.parse(event.data);

    if (msg.type === 'auth_success') {
      startHeartbeat(ws);
    } else if (msg.type === 'ping') {
      if (debug)
        console.log('WebSocket ping received, sending pong...');
      
      ws.send(JSON.stringify({ type: 'pong' }));
    } else if (msg.type === 'pong') {
      if (debug)
        console.log('WebSocket pong received');

      clearTimeout(pongTimer);
    }

    handler?.(msg);
  };

  ws.onclose = () => {
    if (validSocket !== ws)
      return;

    stopHeartbeat();
    console.log('WebSocket connection to IA Desk closed');
    onClose?.();
  };

  ws.onerror = (err) => {
    if (validSocket !== ws)
      return;

    console.error('WS error:', err);
    onError?.(err);
  };

  return ws;
}

function connectToIADeskSocket(authorizationToken, options, attempt = 0) {
  const newOptions = { ...options };
  newOptions.onClose = () => {
    const index = attempt % reconnectDelays.length;
    const delay = reconnectDelays[index];
    console.log(`WebSocket connection closed, retrying in ${delay}ms...`);
    setTimeout(() => {
      connectToIADeskSocket(authorizationToken, options, attempt + 1);
    }, delay);
    options.onClose?.();
  };

  const ws = openIADeskSocket(authorizationToken, newOptions);

  return ws;
}

export function ApiProvider({
  children,
  urlBase: initialUrlBase = '',
  debug: initialDebug = false,
  authorization: initialAuthorization,
  authorizationToken: initialAuthorizationToken,
  authorizationExpireAt: initialAuthorizationExpireAt,
}) {
  const [urlBase, setUrlBase] = useState(initialUrlBase);
  const [debug, setDebug] = useState(initialDebug);
  const [authorization, setAutorization] = useState(initialAuthorization);
  const [authorizationToken, setAuthorizationToken] = useState(initialAuthorizationToken);
  const [authorizationExpireAt, setAuthorizationExpireAt] = useState(initialAuthorizationExpireAt);
  const [iaDeskSocket, setIADeskSocket] = useState(null);

  const fetch = useCallback(async (service, options) => {
    if (!service) {
      throw new Error('El servicio no puede ser nulo o indefinido.');
    }

    options ??= {};

    var url = `${urlBase}/${service}`;
    var method = options.method || 'GET';
    var headers = options.headers || {};
    var body = options.body;

    if (options.query) {
      let queryParams;
      if (options.query instanceof URLSearchParams) {
        queryParams = options.query.toString();
      } else if (typeof options.query === 'object') {
        queryParams = new URLSearchParams(options.query);
        if (!queryParams.size)
          queryParams = null;
      } else if (typeof options.query === 'string') {
        queryParams = options.query;
      } else {
        throw new Error('El parámetro "query" debe ser un objeto, una cadena o una instancia de URLSearchParams.');
      }

      if (queryParams) {
        if (queryParams[0] !== '?')
          queryParams = `?${queryParams}`;

        url += queryParams;
      }
    }

    if (typeof options.authorization !== 'undefined') {
      if (options.authorization) {
        headers['Authorization'] = options.authorization;
      }
    } else if (typeof options.Authorization !== 'undefined') {
      if (options.Authorization) {
        headers['Authorization'] = options.Authorization;
      }
    } else if (typeof options.headers?.authorization !== 'undefined') {
      if (options.headers.authorization) {
        headers['Authorization'] = options.headers.Authorization;
      }
    } else if (typeof options.headers?.Authorization !== 'undefined') {
      if (options.headers.Authorization) {
        headers['Authorization'] = options.headers.Authorization;
      }
    } else if (authorization && (!authorizationExpireAt || authorizationExpireAt > new Date())) {
      headers['Authorization'] = authorization;
    }

    if (options.json) {
      headers['Content-Type'] = 'application/json';
      if (options.body && typeof options.body === 'object') {
        body = JSON.stringify(options.body);
      }
    }

    if (options.debug === true
      || options.debug?.request
      || debug === true
      || debug?.request
    ) {
      console.log(`API Request: ${method} ${url}`, {
        headers,
        body,
      });
    }

    let res = await window.fetch(url, {
      method,
      headers,
      body,
    });

    let data = res;

    if (options.json) {
      if (res.headers.get('Content-Type')?.startsWith('application/json')) {
        data = await data.json();
      } else if (res.status === 204) {
        data = null;
      } else if (res.status === 200) {
        throw new Error('Se esperaba una respuesta JSON, pero se recibió: ' + res.headers.get('Content-Type'));
      }
    }

    if (options.debug === true
      || options.debug?.response
      || debug === true
      || debug?.response
    ) {
      console.log(`API Response: ${method} ${url}`, data);
    }

    if (!res.ok) {
      if (options.error) {
        options.error({ data, res });
      } else {
        const error = new Error('Error en la respuesta de la API: ' + res.status + ' ' + res.statusText);
        error.data = data;
        error.response = res;

        throw error;
      }
    }

    if (options.normalizeItem && typeof options.normalizeItem === 'function') {
      if (Array.isArray(data)) {
        data = data.map(options.normalizeItem);
      } else {
        data = options.normalizeItem(data);
      }
    }

    return data;
  }, [debug, urlBase, authorization, authorizationExpireAt]);

  const fetchJson = useCallback(async (service, options) => {
    return await fetch(service, {
      ...options,
      json: true,
    });
  }, [fetch]);

  const getJson = useCallback(async (service, options) => {
    return await fetchJson(service, {
      ...options,
      method: 'GET',
    });
  }, [fetchJson]);

  const postJson = useCallback(async (service, options) => {
    return await fetchJson(service, {
      ...options,
      method: 'POST',
    });
  }, [fetchJson]);

  const putJson = useCallback(async (service, options) => {
    return await fetchJson(service, {
      ...options,
      method: 'PUT',
    });
  }, [fetchJson]);

  const deleteJson = useCallback(async (service, options) => {
    return await fetchJson(service, {
      ...options,
      method: 'DELETE',
    });
  }, [fetchJson]);

  const patchJson = useCallback(async (service, options) => {
    return await fetchJson(service, {
      ...options,
      method: 'PATCH',
    });
  }, [fetchJson]);

  
  useEffect(() => {
    if (!authorizationToken) {
      if (iaDeskSocket) {
        console.log('Closing IA Desk WebSocket connection due to missing authorization token...');
        iaDeskSocket.close();
      }

      return;
    }

    const socket = connectToIADeskSocket(
      authorizationToken,
      {
        onOpen: () => {
          setIADeskSocket(socket);
          console.log('IA Desk WS opened');
        },
        onClose: () => {
          if (iaDeskSocket === socket) {
            setIADeskSocket(null);
            console.log('IA Desk WS closed');
          }
        },
        onError: (err) => {
          setIADeskSocket(null);
          console.error('IA Desk WS error:', err);
        },
        handler: (msg) => console.log('IA Desk WS message:', msg),
      }
    );
  }, [authorizationToken]);

  return <ApiContext.Provider
    value={{
      urlBase, setUrlBase,
      debug, setDebug,
      authorization, setAutorization,
      authorizationToken, setAuthorizationToken,
      authorizationExpireAt, setAuthorizationExpireAt,
      fetch,
      fetchJson,
      getJson,
      postJson,
      putJson,
      deleteJson,
      patchJson,
      iaDeskSocket,
    }}
  >
    {children}
  </ApiContext.Provider>;
}

export default function useApi() {
  return useContext(ApiContext);
}