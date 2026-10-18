export const requesterTypes = [
    {
    value: 'customer',
    name: 'Cliente',
    detail: 'Persona que se comunica por WhatsApp solicitando soporte técnico'
  },
  {
    value: 'user',
    name: 'Usuario',
    detail: 'Personal interno de Minetech que solicita soporte técnico'
  },
  {
    value: 'system',
    name: 'Sistema',
    detail: 'Mensajes automáticos generados por MineTech (RAG, notificaciones, auditoría)'
  },
];

export const requesterTypeValues = requesterTypes.map(s => s.value);