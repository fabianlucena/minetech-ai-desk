export const turnTypes = [
  {
    value: 'primary',
    name: 'Principal',
    detail: 'Técnico de guardia responsable de atender las consultas'
  },
  {
    value: 'backup',
    name: 'Reserva',
    detail: 'Técnico de apoyo que cubre al principal si no está disponible'
  }
];

export const turnTypeValues = turnTypes.map(t => t.value);