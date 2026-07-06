import getDependency from '../dependency.js';
import { CompanyDTO } from '../dto/company.dto.js';

export async function getList(req, res) {
  const companyService = getDependency('companyService');
  const companies = await companyService.getList({
    includeDeleted: !!req.query.includeDeleted,
    session: req.session,
  });
  res.json(companies.map(u => new CompanyDTO(u)));
}

export async function getByUuid(req, res) {
  const companyService = getDependency('companyService');
  const company = await companyService.getByUuid(req.params.uuid, {
    session: req.session,
  });
  res.json(new CompanyDTO(company));
}

export async function create(req, res) {
  const companyService = getDependency('companyService');
  const company = await companyService.create(
    req.body,
    { session: req.session }
  );
  res.json(new CompanyDTO(company));
}

export async function updateByUuid(req, res) {
  const companyService = getDependency('companyService');
  const company = await companyService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new CompanyDTO(company));
}

export async function deleteByUuid(req, res) {
  const companyService = getDependency('companyService');
  await companyService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function restoreByUuid(req, res) {
  const companyService = getDependency('companyService');
  await companyService.restoreByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}