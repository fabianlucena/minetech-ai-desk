insert into auth.permissions (
  uuid,
  name,
  created_at, created_by_id,
  deleted_at, deleted_by_id
) select 
    gen_random_uuid(),
    p.name,
    now(), system.id,
    null, null
  from (values
    ('ragDocuments.create'),('ragDocuments.delete'),('ragDocuments.update'),('ragDocuments.list'),('ragDocuments.read'),('ragDocuments.restore')
  ) as p(name)
  join auth.users system on system.username = 'system'
on conflict (name) do nothing;

insert into auth.permissions_x_roles (
  permission_id, role_id,
  created_at, created_by_id,
  deleted_at, deleted_by_id
) select
    p.id, r.id,
    now(), system.id,
    null, null
  from auth.permissions p
  join auth.users system on system.username = 'system'
  join auth.roles r on r.name = 'admin'
  where p.name in(
    'ragDocuments.create','ragDocuments.delete','ragDocuments.update','ragDocuments.list','ragDocuments.read','ragDocuments.restore'
  )
on conflict (permission_id, role_id) do nothing;