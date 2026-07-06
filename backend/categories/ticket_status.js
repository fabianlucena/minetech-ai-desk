export const ticketStatus = [
  {
    value: 'abierto',
    name: 'Abierto',
    detail: 'El ticket fue creado y está esperando atención'
  },
  {
    value: 'en_proceso',
    name: 'En proceso',
    detail: 'El técnico está trabajando en la consulta'
  },
  {
    value: 'pendiente_cliente',
    name: 'Pendiente del cliente',
    detail: 'Se espera información adicional del operador o cliente'
  },
  {
    value: 'pendiente_tecnico',
    name: 'Pendiente del técnico',
    detail: 'El sistema derivó la consulta y espera respuesta del técnico'
  },
  {
    value: 'cerrado',
    name: 'Cerrado',
    detail: 'El ticket fue resuelto y finalizado'
  },
  {
    value: 'cancelado',
    name: 'Cancelado',
    detail: 'El ticket se cerró sin resolución (duplicado, error, fuera de alcance)'
  }
];

export const ticketStatusValues = ticketStatus.map(s => s.value);
