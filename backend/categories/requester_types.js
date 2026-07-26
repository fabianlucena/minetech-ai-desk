export const requesterTypes = [
    {
    value: 'customer',
    name: 'Cliente',
    detail: 'Persona que se comunica por WhatsApp solicitando soporte técnico'
  },
  {
    value: 'fieldOperator',
    name: 'Operador de campo',
    detail: 'Técnico que reporta lecturas, fallas o novedades desde el sitio'
  },
  {
    value: 'technical',
    name: 'Técnico',
    detail: 'Personal de soporte que atiende consultas y gestiona tickets'
  },
  {
    value: 'system',
    name: 'Sistema',
    detail: 'Mensajes automáticos generados por MineTech (RAG, notificaciones, auditoría)'
  }
];

export const requesterTypeValues = requesterTypes.map(s => s.value);