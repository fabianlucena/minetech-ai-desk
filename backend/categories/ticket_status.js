export const ticketStatus = [
  {
    value: 'open',
    name: 'Abierto',
    detail: 'El ticket fue creado y está esperando atención'
  },
  {
    value: 'in_progress',
    name: 'En proceso',
    detail: 'El técnico está trabajando en la consulta'
  },
  {
    value: 'pending_client',
    name: 'Pendiente del cliente',
    detail: 'Se espera información adicional del solicitante o cliente'
  },
  {
    value: 'pending_technician',
    name: 'Pendiente del técnico',
    detail: 'El sistema derivó la consulta y espera respuesta del técnico'
  },
  {
    value: 'closed',
    name: 'Cerrado',
    detail: 'El ticket fue resuelto y finalizado'
  },
  {
    value: 'cancelled',
    name: 'Cancelado',
    detail: 'El ticket se cerró sin resolución (duplicado, error, fuera de alcance)'
  },
];

export const ticketStatusValues = ticketStatus.map(s => s.value);
export function ticketStatusName(value) {
  return ticketStatus.find(s => s.value === value)?.name;
}