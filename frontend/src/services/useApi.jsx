import { createContext, useContext, useState, useCallback } from 'react';

// oxlint-disable-next-line react/only-export-components
export const ApiContext = createContext();

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
      } else {
        throw new Error('Se esperaba una respuesta JSON, pero no se recibió: ' + res.headers.get('Content-Type'));
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
    }}
  >
    {children}
  </ApiContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export default function useApi() {
  return useContext(ApiContext);
}