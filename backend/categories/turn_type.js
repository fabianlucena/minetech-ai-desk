export const turnTypes = [
  {
    value: 'principal',
    name: 'Principal',
    detail: 'Técnico de guardia responsable de atender las consultas'
  },
  {
    value: 'reserva',
    name: 'Reserva',
    detail: 'Técnico de apoyo que cubre al principal si no está disponible'
  }
];

export const turnTypeValues = turnTypes.map(t => t.value);