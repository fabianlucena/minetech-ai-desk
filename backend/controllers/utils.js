export function getOptionsFromRequest(req) {
  const query = req.query;
  const options = { session: req.session };

  if (query.limit !== undefined)
    options.limit = Math.min(20, parseInt(query.limit, 10));
  else if (query.pageSize !== undefined)
    options.limit = Math.min(20, parseInt(query.pageSize, 10));

  if (query.offset !== undefined)
    options.offset = parseInt(query.offset, 10);
  else if (query.page !== undefined)
    options.offset = parseInt(query.page, 10) * options.limit;

  if (query.includeDeleted !== undefined)
    options.includeDeleted = !!query.includeDeleted;

  return options;
}