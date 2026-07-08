export const senderTypes = [
  {
    value: 'requester',
    name: 'Solicitante',
    detail: 'Persona que llama desde la empresa cliente solicitando asistencia técnica'
  },
  {
    value: 'technician',
    name: 'Técnico',
    detail: 'Técnico de MineTech que atiende el ticket'
  },
  {
    value: 'system',
    name: 'Sistema',
    detail: 'Respuesta automática generada por MineTech AI Desk'
  }
];

export const senderTypeValues = senderTypes.map(t => t.value);