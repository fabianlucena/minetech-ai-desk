export const ragDocumentsStatus = [
  {
    value: 'pending',
    name: 'Pendiente',
    detail: 'El documento fue creado y está esperando para ser procesado',
  },
  {
    value: 'processing',
    name: 'En proceso',
    detail: 'El documento está siendo procesado por el sistema',
  },
  {
    value: 'indexed',
    name: 'Indexado',
    detail: 'El documento ha sido procesado y está disponible para su uso',
  },
  {
    value: 'error',
    name: 'Error',
    detail: 'El documento no pudo ser procesado debido a un error',
  },
];

export const ragDocumentsStatusValues = ragDocumentsStatus.map(s => s.value);
export function ragDocumentsStatusName(value) {
  return ragDocumentsStatus.find(s => s.value === value)?.name;
}