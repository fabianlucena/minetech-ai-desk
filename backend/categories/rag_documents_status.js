export const ragDocumentsStatus = [
  {
    value: 'pending',
    name: 'Pendiente',
    detail: 'El documento fue creado y está esperando para ser procesado',
    color: '#ccccee',
  },
  {
    value: 'processing',
    name: 'En proceso',
    detail: 'El documento está siendo procesado por el sistema',
    color: '#dddddd',
  },
  {
    value: 'indexed',
    name: 'Indexado',
    detail: 'El documento ha sido procesado y está disponible para su uso',
    color: '#cceecc',
  },
  {
    value: 'error',
    name: 'Error',
    detail: 'El documento no pudo ser procesado debido a un error',
    color: '#ffcccc',
  },
];

export const ragDocumentsStatusValues = ragDocumentsStatus.map(s => s.value);
export function ragDocumentsStatusName(value) {
  return ragDocumentsStatus.find(s => s.value === value)?.name;
}