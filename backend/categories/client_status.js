export const clientStatus = [
  {
    value: 'active',
    name: 'Activo',
    detail: 'La empresa está habilitada para recibir soporte'
  },
  {
    value: 'delinquent',
    name: 'Moroso',
    detail: 'La empresa tiene deuda o bloqueo temporal'
  },
  {
    value: 'suspended',
    name: 'Suspendido',
    detail: 'La empresa no puede recibir soporte hasta regularizar su situación'
  },
  {
    value: 'inactive',
    name: 'Inactivo',
    detail: 'La empresa fue dada de baja pero se conserva para auditoría'
  },
  {
    value: 'blocked',
    name: 'Bloqueado',
    detail: 'Bloqueo manual por seguridad, fraude o abuso'
  }
];

export const clientStatusValues = clientStatus.map(s => s.value);
