//import { getDependency } from '../dependency.js';

export default class RagEngineService {
  constructor() {
  }
}

/*

import { qdrantSearch } from '../rag/qdrant.js';
import { llm } from '../ai/llm.js';

export async function ragEngine(query) {
  // 1) Buscar fragmentos relevantes
  const results = await qdrantSearch(query);

  // 2) Construir prompt
  const context = results.map(r => r.text).join('\n\n');

  const prompt = `
Contexto de documentación:
${context}

Pregunta del cliente:
${query}

Generá una respuesta técnica, precisa y basada SOLO en el contexto.
Si el contexto no es suficiente, decí "No tengo suficiente información".
`;

  // 3) LLM
  const answer = await llm(prompt);

  // 4) Calcular confianza
  const confidence = results.length > 0 ? results[0].score : 0;

  return {
    answer,
    confidence
  };
}
*/