import Api from '../utils/api.js';

export async function getTurns(params) {
  let turns = await Api.getJson('turns', params);
  turns = turns.map(turn => ({
    ...turn,
    startDate: new Date(turn.startDate),
    endDate: new Date(turn.endDate),
  }));
  return turns;
}

export async function getTurn(uuid, params) {
  return await Api.getJson(`turns/${uuid}`, params);
}

export async function getTypes(params) {
  return await Api.getJson('turns/types', params);
}

export async function getTechnicians(params) {
  return await Api.getJson('turns/technicians', params);
}

export async function createTurn(data) {
  return await Api.postJson('turns', { body: data });
}

export async function updateTurn(uuid, data) {
  return await Api.putJson(`turns/${uuid}`, { body: data });
}

export async function deleteTurn(uuid) {
  return await Api.deleteJson(`turns/${uuid}`);
}

export async function restoreTurn(uuid) {
  return await Api.patchJson(`turns/${uuid}/restore`);
}