import { urlBase } from '../config.js';

export default class Api {
  static debug = false;
  static Authorization = null;
  static AuthorizationExpireAt = null;

  static async fetch(service, options) {
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
      } else if (typeof options.query === 'string') {
        queryParams = options.query;
      } else {
        throw new Error('El parámetro "query" debe ser un objeto, una cadena o una instancia de URLSearchParams.');
      }

      if (queryParams[0] !== '?')
        queryParams = `?${queryParams}`;

      url += queryParams;
    }

    if (typeof options.Authorization !== 'undefined') {
      if (options.Authorization) {
        headers['Authorization'] = options.Authorization;
      }
    } else if (this.Authorization && !options.headers?.Authorization && (!this.AuthorizationExpireAt || this.AuthorizationExpireAt > new Date())) {
      headers['Authorization'] = this.Authorization;
    } else if (Api.Authorization && !options.headers?.Authorization && (!Api.AuthorizationExpireAt || Api.AuthorizationExpireAt > new Date())) {
      headers['Authorization'] = Api.Authorization;
    }

    if (options.json) {
      headers['Content-Type'] = 'application/json';
      if (options.body && typeof options.body === 'object') {
        body = JSON.stringify(options.body);
      }
    }

    if (options.debug === true
      || options.debug?.request
      || this.debug === true
      || this.debug?.request
    ) {
      console.log(`API Request: ${method} ${url}`, {
        headers,
        body,
      });
    }

    var res = await fetch(url, {
      method,
      headers,
      body,
    });

    var data = res;

    if (options.json) {
      if (res.headers.get('Content-Type')?.startsWith('application/json')) {
        data = await data.json();
      } else if (res.status === 204) {
        data = null;
      }
    }

    if (options.debug === true
      || options.debug?.response
      || this.debug === true
      || this.debug?.response
    ) {
      console.log(`API Response: ${method} ${url}`, data);
    }

    if (!res.ok) {
      if (options.error) {
        options.error({ data, res });
      } else {
        throw {
          error: new Error('Error en la respuesta de la API: ' + res.status + ' ' + res.statusText),
          data,
          res,
        };
      }
    }

    return data;
  }

  static async fetchJson(service, options) {
    return await this.fetch(service, {
      ...options,
      json: true,
    });
  }

  static async getJson(service, options) {
    return await this.fetch(service, {
      ...options,
      method: 'GET',
      json: true,
    });
  }

  static async postJson(service, options) {
    return await this.fetch(service, {
      ...options,
      method: 'POST',
      json: true,
    });
  }

  static async putJson(service, options) {
    return await this.fetch(service, {
      ...options,
      method: 'PUT',
      json: true,
    });
  }

  static async deleteJson(service, options) {
    return await this.fetch(service, {
      ...options,
      method: 'DELETE',
      json: true,
    });
  }
}