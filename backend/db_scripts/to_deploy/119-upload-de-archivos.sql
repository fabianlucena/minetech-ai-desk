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

create table if not exists ia_desk.rag_documents (
    id bigserial primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default current_timestamp,
    created_by_id bigint not null,

    updated_at timestamp not null default current_timestamp,
    updated_by_id bigint not null,

    deleted_at timestamp null,
    deleted_by_id bigint null,

    file_name varchar(255) not null,
    file_path text not null,
    mime_type varchar(100) not null,
    file_size bigint not null,
    checksum varchar(128) not null,

    status varchar(50) not null,

    constraint uk_ia_desk_rag_documents_uuid unique (uuid),
    constraint uk_ia_desk_rag_documents_checksum unique (checksum),

    constraint fk_ia_desk_rag_documents_created_by_id foreign key (created_by_id)
      references auth.users(id) on delete restrict,
    
    constraint fk_ia_desk_rag_documents_updated_by_id foreign key (updated_by_id)
      references auth.users(id) on delete restrict,
    
    constraint fk_ia_desk_rag_documents_deleted_by_id foreign key (deleted_by_id)
      references auth.users(id) on delete restrict
);

create index if not exists ik__ia_desk_rag_documents_status
  on ia_desk.rag_documents(status);