export const shiftTypes = [
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

export const shiftTypeValues = shiftTypes.map(s => s.value);