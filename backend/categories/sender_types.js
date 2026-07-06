export const senderTypes = [
  {
    value: 'operator',
    name: 'Operador',
    detail: 'Persona que llama desde la empresa cliente'
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