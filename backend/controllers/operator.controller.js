import getDependency from '../dependency.js';
import { OperatorDTO } from '../dto/operator.dto.js';
import { operatorStatus } from '../categories/operator_status.js';

export async function getList(req, res) {
  const operatorService = getDependency('operatorService');
  const operators = await operatorService.getList({
    includeDeleted: !!req.query.includeDeleted,
    session: req.session,
  });
  res.json(operators.map(u => new OperatorDTO(u)));
}

export async function getByUuid(req, res) {
  const operatorService = getDependency('operatorService');
  const operator = await operatorService.getByUuid(req.params.uuid, {
    session: req.session,
  });
  res.json(new OperatorDTO(operator));
}

export async function create(req, res) {
  const operatorService = getDependency('operatorService');
  const operator = await operatorService.create(
    req.body,
    { session: req.session }
  );
  res.json(new OperatorDTO(operator));
}

export async function updateByUuid(req, res) {
  const operatorService = getDependency('operatorService');
  const operator = await operatorService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new OperatorDTO(operator));
}

export async function deleteByUuid(req, res) {
  const operatorService = getDependency('operatorService');
  await operatorService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function restoreByUuid(req, res) {
  const operatorService = getDependency('operatorService');
  await operatorService.restoreByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}