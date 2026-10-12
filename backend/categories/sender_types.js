export const senderTypes = [
  {
    value: 'requester',
    name: 'Solicitante',
    detail: 'Persona que llama desde la empresa cliente solicitando asistencia técnica'
  },
  {
    value: 'user',
    name: 'Usuario',
    detail: 'Usuario de MineTech que atiende el ticket'
  },
  {
    value: 'ia',
    name: 'Minetech IA',
    detail: 'Inteligencia artificial de MineTech'
  },
  {
    value: 'system',
    name: 'Sistema',
    detail: 'Respuesta automática generada por MineTech AI Desk'
  },
];

export const senderTypeValues = senderTypes.map(t => t.value);