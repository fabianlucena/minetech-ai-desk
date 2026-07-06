create schema if not exists auth;

do $$ -- users table
begin
  create table if not exists auth.users(
    id bigint generated always as identity primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default now(),
    created_by_id bigint not null,

    updated_at timestamp not null default now(),
    updated_by_id bigint not null,

    deleted_at timestamp null,
    deleted_by_id bigint null,

    username varchar(64) not null,
    display_name varchar(128) not null,
    is_active boolean not null,
    can_login boolean not null,
    last_login_at timestamp null,

    constraint uk_auth_users_uuid unique (uuid),
    constraint uk_auth_users_username unique (username)
  );

  if not exists (
    select 1
    from auth.users
    where username = 'system'
  ) then
    insert into auth.users (
      uuid,
      created_at, created_by_id, 
      updated_at, updated_by_id, 
      deleted_at, deleted_by_id,
      username, display_name,
      is_active, can_login, last_login_at
    )
    values (
      gen_random_uuid(),
      now(), 1,
      now(), 1,
      null, null,
      'system', 'System',
      true, true, null
    )
    on conflict (username) do nothing;
  end if;

  with sys as (select id from auth.users where username = 'system')
  update auth.users u
  set created_by_id = sys.id,
      updated_by_id = sys.id
  from sys
  where u.id = sys.id;
  
  if not exists (
    select 1
    from pg_constraint
    where conname = 'fk_auth_users_created_by_id'
  ) then
    alter table auth.users
      add constraint fk_auth_users_created_by_id
        foreign key (created_by_id)
        references auth.users(id)
        on delete restrict;
  end if;
  
  if not exists (
    select 1
    from pg_constraint
    where conname = 'fk_auth_users_updated_by_id'
  ) then
    alter table auth.users
      add constraint fk_auth_users_updated_by_id
        foreign key (updated_by_id)
        references auth.users(id)
        on delete restrict;
  end if;
  
  if not exists (
    select 1
    from pg_constraint
    where conname = 'fk_auth_users_deleted_by_id'
  ) then
    alter table auth.users
      add constraint fk_auth_users_deleted_by_id
        foreign key (deleted_by_id)
        references auth.users(id)
        on delete restrict;
  end if;
end $$;

-- user_passwords table
create table if not exists auth.user_passwords (
  user_id bigint not null primary key,

  created_at timestamp not null default now(),
  created_by_id bigint not null,

  updated_at timestamp not null default now(),
  updated_by_id bigint not null,

  deleted_at timestamp null,
  deleted_by_id bigint null,

  password_hash varchar(256) not null,

  constraint uk_auth_users_passwords_user_id unique (user_id),

  constraint fk_auth_user_passwords_user_id
    foreign key (user_id) references auth.users(id) on delete restrict,

  constraint fk_auth_user_passwords_created_by_id
    foreign key (created_by_id) references auth.users(id) on delete restrict,

  constraint fk_auth_user_passwords_updated_by_id
    foreign key (updated_by_id) references auth.users(id) on delete restrict,

  constraint fk_auth_user_passwords_deleted_by_id
    foreign key (deleted_by_id) references auth.users(id) on delete restrict
);

do $$ -- Check system user
begin
  if not exists (select 1 from auth.users where username = 'system') then
    raise exception 'El usuario system no existe.';
  end if;
end $$;

do $$ -- Insert default admin user
begin
  if not exists (
    select 1
    from auth.users
    where username = 'admin'
  ) then
    insert into auth.users (
      uuid,
      created_at, created_by_id,
      updated_at, updated_by_id,
      username, display_name,
      is_active, can_login, last_login_at
    )
    values (
      gen_random_uuid(),
      now(), 1,
      now(), 1,
      'admin', 'Administrator',
      true, true, null
    )
    on conflict (username) do nothing;
  end if;
end $$;

-- Insert default admin user pasword (only if admin does not have password) 1234
insert into auth.user_passwords (
  user_id,
  password_hash,
  created_at, updated_at, deleted_at,
  created_by_id, updated_by_id, deleted_by_id
)
select admin.id, 
  '$argon2id$v=19$m=65536,t=3,p=1$hN9eEqA0ugalPrBh8RljeQ$zaQ96ZcE+UCW/BPWnpnf+2/ZKy6y0/RYo6skrg/KKH0',
  now(), now(), null,
  system.id, system.id, null
from auth.users admin, auth.users system
where admin.username = 'admin'
  and system.username = 'system'
on conflict (user_id) do nothing;

-- devices table
create table if not exists auth.devices (
  id bigint generated always as identity primary key,
  uuid uuid not null default gen_random_uuid(),

  created_at timestamp not null default now(),
  created_by_id bigint not null,

  token varchar(64) not null,

  constraint uk_auth_devices_token unique (token),

  constraint uk_auth_devices_uuid unique (uuid),

  constraint fk_auth_devices_created_by_id foreign key (created_by_id)
    references auth.users(id) on delete restrict
);

-- sessions table
create table if not exists auth.sessions (
  id bigint generated always as identity primary key,
  uuid uuid not null default gen_random_uuid(),

  created_at timestamp not null default now(),
  created_by_id bigint not null,

  authorization_token varchar(64) not null,
  expires_at timestamp not null,
  auto_login_token varchar(64) not null,
  last_used_at timestamp not null,
  closed_at timestamp null,

  user_id bigint not null,
  device_id bigint not null,
  data_json text null,

  constraint uk_auth_sessions_authorization_token unique (authorization_token),

  constraint uk_auth_sessions_auto_login_token unique (auto_login_token),

  constraint uk_auth_sessions_uuid unique (uuid),

  constraint fk_auth_sessions_User foreign key (user_id)
    references auth.users(id) on delete restrict,
    
  constraint fk_auth_sessions_Device foreign key (device_id)
    references auth.devices(id) on delete restrict,

  constraint fk_auth_sessions_created_by_id foreign key (created_by_id)
    references auth.users(id) on delete restrict
);

-- roles table
create table if not exists auth.roles (
  id bigint generated always as identity primary key,
  uuid uuid not null default gen_random_uuid(),

  created_at timestamp not null default now(),
  created_by_id bigint not null,

  updated_at timestamp not null default now(),
  updated_by_id bigint not null,

  deleted_at timestamp null,
  deleted_by_id bigint null,

  name varchar(256) not null,
  title text null,
  description text null,
  is_asignable boolean not null,

  constraint uk_auth_roles_name unique (name),

  constraint uk_auth_roles_uuid unique (uuid),

  constraint fk_auth_roles_created_by_id foreign key (created_by_id)
    references auth.users(id) on delete restrict,

  constraint fk_auth_roles_updated_by_id foreign key (updated_by_id)
    references auth.users(id) on delete restrict,

  constraint fk_auth_roles_deleted_by_id foreign key (deleted_by_id)
    references auth.users(id) on delete restrict
);

-- Insert default admin role
insert into auth.roles (
  uuid,
  name, title, description,
  is_asignable,
  created_at, created_by_id,
  updated_at, updated_by_id,
  deleted_at, deleted_by_id
) select 
    gen_random_uuid(),
    'admin', 'Administrator', 'Administrator role with full privileges',
    true,
    now(), system.id,
    now(), system.id,
    null, null
  from auth.users system
  where system.username = 'system'
on conflict (name) do nothing;

-- roles_x_users table
create table if not exists auth.roles_x_users (
  role_id bigint not null,
  user_id bigint not null,

  created_at timestamp not null default now(),
  created_by_id bigint not null,
  
  updated_at timestamp not null,
  updated_by_id bigint not null,

  deleted_at timestamp null,
  deleted_by_id bigint null,

  constraint pk_auth_roles_x_users primary key (role_id,user_id),

  constraint fk_auth_roles_x_users_role foreign key (role_id)
    references auth.roles(id) on delete restrict,

  constraint fk_auth_roles_x_users_User foreign key (user_id)
    references auth.users(id) on delete restrict,

  constraint fk_auth_roles_x_users_created_by_id foreign key (created_by_id)
    references auth.users(id) on delete restrict,

  constraint fk_auth_roles_x_users_updated_by_id foreign key (updated_by_id)
    references auth.users(id) on delete restrict,

  constraint fk_auth_roles_x_users_deleted_by_id foreign key (deleted_by_id)
    references auth.users(id) on delete restrict
);

-- Insert default admin user's role
insert into auth.roles_x_users (
  role_id, user_id,
  created_at, created_by_id,
  updated_at, updated_by_id,
  deleted_at, deleted_by_id
) select 
    role_admin.id, user_admin.id,
    now(), user_system.id,
    now(), user_system.id,
    null, null
  from auth.roles role_admin,
    auth.users user_admin,
    auth.users user_system
  where role_admin.name = 'admin' 
    and user_admin.username = 'admin' 
    and user_system.username = 'system'
on conflict (role_id, user_id) do nothing;

-- roles_includes table
create table if not exists auth.roles_includes (
  role_id bigint not null,
  include_id bigint not null,

  created_at timestamp not null default now(),
  created_by_id bigint not null,

  deleted_at timestamp null,
  deleted_by_id bigint null,

  constraint pk_auth_roles_includes primary key (role_id,include_id),

  constraint fk_auth_roles_includes_role foreign key (role_id)
    references auth.roles(id) on delete restrict,

  constraint fk_auth_roles_includes_include foreign key (include_id)
    references auth.roles(id) on delete restrict,

  constraint fk_auth_roles_includes_created_by_id foreign key (created_by_id)
    references auth.users(id) on delete restrict,

  constraint fk_auth_roles_includes_deleted_by_id foreign key (deleted_by_id)
    references auth.users(id) on delete restrict
);

-- permissions table
create table if not exists auth.permissions (
  id bigint generated always as identity primary key,
  uuid uuid not null default gen_random_uuid(),

  name varchar(255) not null,

  created_at timestamp not null default now(),
  created_by_id bigint not null,

  deleted_at timestamp null,
  deleted_by_id bigint null,

  constraint uk_auth_permissions_name unique (name),

  constraint fk_auth_permissions_created_by_id foreign key (created_by_id)
    references auth.users(id) on delete restrict,

  constraint fk_auth_permissions_deleted_by_id foreign key (deleted_by_id)
    references auth.users(id) on delete restrict
);

-- permissions_x_roles table
create table if not exists auth.permissions_x_roles (
  permission_id bigint not null,
  role_id bigint not null,

  created_at timestamp not null default now(),
  created_by_id bigint not null,

  deleted_at timestamp null,
  deleted_by_id bigint null,

  constraint pk_auth_permissions_x_roles primary key (permission_id,role_id),

  constraint fk_auth_permissions_x_roles_Permission foreign key (permission_id)
    references auth.permissions(id) on delete restrict,

  constraint fk_auth_permissions_x_roles_role foreign key (role_id)
    references auth.roles(id) on delete restrict,

  constraint fk_auth_permissions_x_roles_created_by_id foreign key (created_by_id)
    references auth.users(id) on delete restrict,

  constraint fk_auth_permissions_x_roles_deleted_by_id foreign key (deleted_by_id)
    references auth.users(id) on delete restrict
);

-- Insert permissions
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
    ('users.create'),('users.delete'),('users.update'),('users.list'),('users.read'),('users.restore'),
    ('technicians.create'),('technicians.delete'),('technicians.update'),('technicians.list'),('technicians.read'),('technicians.restore'),
    ('clients.create'),('clients.delete'),('clients.update'),('clients.list'),('clients.read'),('clients.restore')
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
on conflict (permission_id, role_id) do nothing;

-- Schema  ia_desk
create schema if not exists ia_desk;

-- Table technicians
create table if not exists ia_desk.technicians(
    id bigint generated always as identity primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default now(),
    created_by_id bigint not null,

    updated_at timestamp not null default now(),
    updated_by_id bigint not null,

    deleted_at timestamp null,
    deleted_by_id bigint null,

    full_name varchar(128) not null,
    phone varchar(64) not null,
    is_active boolean not null,
    
    constraint uk_ia_desk_technicians_uuid unique (uuid),
    constraint uk_ia_desk_technicians_full_name unique (full_name),
    
    constraint uk_ia_desk_technicians_created_by_id foreign key (created_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_technicians_updated_by_id foreign key (updated_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_technicians_deleted_by_id foreign key (deleted_by_id)
      references auth.users(id) on delete restrict
);

-- Table clients
create table if not exists ia_desk.clients(
    id bigint generated always as identity primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default now(),
    created_by_id bigint not null,

    updated_at timestamp not null default now(),
    updated_by_id bigint not null,

    deleted_at timestamp null,
    deleted_by_id bigint null,

    name varchar(128) not null,
    code varchar(128) not null,
    token varchar(64) not null,
    is_active boolean not null,
    status varchar(64) not null,
    
    constraint uk_ia_desk_clients_uuid unique (uuid),
    constraint uk_ia_desk_clients_name unique (name),
    constraint uk_ia_desk_clients_token unique (token),
    
    constraint uk_ia_desk_clients_created_by_id foreign key (created_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_clients_updated_by_id foreign key (updated_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_clients_deleted_by_id foreign key (deleted_by_id)
      references auth.users(id) on delete restrict
);

-- Table operator
create table if not exists ia_desk.operators(
    id bigint generated always as identity primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default now(),
    created_by_id bigint not null,

    updated_at timestamp not null default now(),
    updated_by_id bigint not null,

    deleted_at timestamp null,
    deleted_by_id bigint null,
    
    client_id bigint not null,

    full_name varchar(128) not null,
    phone varchar(64) not null,
    email varchar(64) null,
    is_active boolean not null,
    
    constraint uk_ia_desk_operators_uuid unique (uuid),
    constraint uk_ia_desk_operators_full_name unique (full_name),
    constraint uk_ia_desk_operators_phone unique (full_name),
    constraint uk_ia_desk_operators_email unique (full_name),
    
    constraint uk_ia_desk_operators_client_id foreign key (client_id)
      references ia_desk.clients(id) on delete restrict,
    
    constraint uk_ia_desk_operators_created_by_id foreign key (created_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_operators_updated_by_id foreign key (updated_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_operators_deleted_by_id foreign key (deleted_by_id)
      references auth.users(id) on delete restrict
);