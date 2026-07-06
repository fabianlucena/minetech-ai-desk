export const companyStatus = [
  {
    value: 'activo',
    name: 'Activo',
    detail: 'La empresa está habilitada para recibir soporte'
  },
  {
    value: 'moroso',
    name: 'Moroso',
    detail: 'La empresa tiene deuda o bloqueo temporal'
  },
  {
    value: 'suspendido',
    name: 'Suspendido',
    detail: 'La empresa no puede recibir soporte hasta regularizar su situación'
  },
  {
    value: 'inactivo',
    name: 'Inactivo',
    detail: 'La empresa fue dada de baja pero se conserva para auditoría'
  },
  {
    value: 'bloqueado',
    name: 'Bloqueado',
    detail: 'Bloqueo manual por seguridad, fraude o abuso'
  }
];

export const companyStatusValues = companyStatus.map(s => s.value);
