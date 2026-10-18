export const authStatus = [
  {
    value: 'initiating',
    name: 'Iniciando',
    detail: 'El solicitante ha iniciado una comunicación'
  },
  {
    value: 'waiting_client_code',
    name: 'Esperando código de cliente',
    detail: 'El solicitante ha iniciado una comunicación, pero aún no ha ingresardo el código de cliente'
  },
  {
    value: 'waiting_access_code',
    name: 'Esperando código de acceso',
    detail: 'El solicitante ha ingresado el código de cliente, pero aún no ha obtenido acceso'
  },
  {
    value: 'authenticated',
    name: 'Autenticado',
    detail: 'El solicitante ha sido autenticado y puede realizar una consulta'
  },
  {
    value: 'locked',
    name: 'Bloqueado',
    detail: 'El solicitante ha sido temporalmente bloqueado y no puede realizar consultas'
  },
];

export const authStatusValues = authStatus.map(s => s.value);
