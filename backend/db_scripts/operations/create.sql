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
    email varchar(255) null,

    constraint uk_auth_users_uuid unique (uuid),
    constraint uk_auth_users_username unique (username),
    constraint uk_auth_users_email unique (email)
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
  id bigint not null primary key,

  created_at timestamp not null default now(),
  created_by_id bigint not null,

  updated_at timestamp not null default now(),
  updated_by_id bigint not null,

  deleted_at timestamp null,
  deleted_by_id bigint null,

  password_hash varchar(256) not null,

  constraint uk_auth_users_passwords_id unique (id),

  constraint fk_auth_user_passwords_id
    foreign key (id) references auth.users(id) on delete restrict,

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
  id,
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
on conflict (id) do nothing;

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
    r.name, r.title, r.description,
    true,
    now(), system.id,
    now(), system.id,
    null, null
  from auth.users system
  cross join (values
    ('admin', 'Administrador', 'Administrador de sistema con privilegios completos'),
    ('technician', 'Técnico', 'Técnico para atender solicitudes de clientes')
  ) as r(name, title, description)
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
    ('clients.create'),('clients.delete'),('clients.update'),('clients.list'),('clients.read'),('clients.restore'),
    ('requesters.create'),('requesters.delete'),('requesters.update'),('requesters.list'),('requesters.read'),('requesters.restore'),('requesters.ban'),('requesters.unban'),
    ('shifts.create'),('shifts.delete'),('shifts.update'),('shifts.list'),('shifts.read'),('shifts.restore'),
    ('settings.create'),('settings.delete'),('settings.update'),('settings.list'),('settings.read'),('settings.restore'),
    ('conversations.list'),('conversations.read'),('conversations.delete'),('conversations.restore'),('conversations.close'),('conversations.viewChat'),
    ('conversationMessages.list'),('conversationMessages.read')
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

-- Table settings
create table if not exists ia_desk.settings(
    id bigint generated always as identity primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default now(),
    created_by_id bigint not null,

    updated_at timestamp not null default now(),
    updated_by_id bigint not null,

    deleted_at timestamp null,
    deleted_by_id bigint null,

    key text not null,
    value jsonb null,
    description text null,
    
    constraint uk_ia_desk_settings_uuid unique (uuid),
    constraint uk_ia_desk_settings_key unique (key),
    
    constraint uk_ia_desk_settings_created_by_id foreign key (created_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_settings_updated_by_id foreign key (updated_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_settings_deleted_by_id foreign key (deleted_by_id)
      references auth.users(id) on delete restrict
);

-- Table technicians
create table if not exists ia_desk.technicians(
    id bigint primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default now(),
    created_by_id bigint not null,

    updated_at timestamp not null default now(),
    updated_by_id bigint not null,

    deleted_at timestamp null,
    deleted_by_id bigint null,

    phone varchar(64) not null,
    is_active boolean not null,
    color varchar(10) null,
  
    constraint uk_ia_desk_technicians_id unique (id),
    
    constraint uk_ia_desk_technicians_uuid unique (uuid),
    
    constraint uk_ia_desk_technicians_id foreign key (id)
      references auth.users(id) on delete restrict,
    
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

-- Table requester
create table if not exists ia_desk.requesters(
    id bigint generated always as identity primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default now(),
    created_by_id bigint not null,

    updated_at timestamp not null default now(),
    updated_by_id bigint not null,

    deleted_at timestamp null,
    deleted_by_id bigint null,
    
    client_id bigint null,

    display_name varchar(128) null,
    phone varchar(64) not null,
    email varchar(64) null,
    type varchar(64) not null,

    banned_at timestamp null,
    banned_by_id bigint null,
    ban_reason text null,
    
    constraint uk_ia_desk_requesters_uuid unique (uuid),
    constraint uk_ia_desk_requesters_phone unique (phone),
    
    constraint uk_ia_desk_requesters_client_id foreign key (client_id)
      references ia_desk.clients(id) on delete restrict,
    
    constraint uk_ia_desk_requesters_created_by_id foreign key (created_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_requesters_updated_by_id foreign key (updated_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_requesters_deleted_by_id foreign key (deleted_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_requesters_banned_by_id foreign key (banned_by_id)
      references auth.users(id) on delete restrict
);

-- Table shifts
create table if not exists ia_desk.shifts(
    id bigint generated always as identity primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default now(),
    created_by_id bigint not null,

    updated_at timestamp not null default now(),
    updated_by_id bigint not null,

    deleted_at timestamp null,
    deleted_by_id bigint null,
    
    technician_id bigint not null,

    type varchar(64) not null,
    start timestamp not null,
    "end" timestamp not null,
    
    constraint uk_ia_desk_shifts_uuid unique (uuid),
    
    constraint uk_ia_desk_shifts_technician_id foreign key (technician_id)
      references ia_desk.technicians(id) on delete restrict,
    
    constraint uk_ia_desk_shifts_created_by_id foreign key (created_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_shifts_updated_by_id foreign key (updated_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_shifts_deleted_by_id foreign key (deleted_by_id)
      references auth.users(id) on delete restrict
);

-- Table conversations
create table if not exists ia_desk.conversations(
    id bigint generated always as identity primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp null,

    deleted_at timestamp null,
    deleted_by_id bigint null,

    requester_id bigint not null,
    client_id bigint null,
    last_message_at timestamp null,

    closed_at timestamp null,
    closed_by_id bigint null,

    constraint uk_ia_desk_conversations_uuid unique (uuid),
    
    constraint uk_ia_desk_conversations_requester_id foreign key (requester_id)
      references ia_desk.requesters(id) on delete restrict,
    
    constraint uk_ia_desk_conversations_client_id foreign key (client_id)
      references ia_desk.clients(id) on delete restrict,
    
    constraint uk_ia_desk_conversations_deleted_by_id foreign key (deleted_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_conversations_closed_by_id foreign key (closed_by_id)
      references auth.users(id) on delete restrict
);

-- Table conversation_messages
create table if not exists ia_desk.conversation_messages(
    id bigint generated always as identity primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default now(),
    updated_at timestamp null,
    updated_by_id bigint null,
    deleted_at timestamp null,
    deleted_by_id bigint null,

    conversation_id bigint not null,
    "text" text null,
    media bytea null,
    external_message_id varchar(255) null,

    sender_type varchar(64) not null,
    sender_id bigint null,
    receiver_type varchar(64) null,
    receiver_id bigint null,

    received_at timestamp not null default now(),
    sent_at timestamp null,
    delivered_at timestamp null,
    read_at timestamp null,
    failed_at timestamp null,
    fail_message text null,

    constraint uk_ia_desk_conversation_messages_uuid unique (uuid),
    
    constraint uk_ia_desk_conversation_messages_conversation_id foreign key (conversation_id)
      references ia_desk.conversations(id) on delete restrict,

    constraint uk_ia_desk_conversation_messages_updated_by_id foreign key (updated_by_id)
      references auth.users(id) on delete restrict,

    constraint uk_ia_desk_conversation_messages_deleted_by_id foreign key (deleted_by_id)
      references auth.users(id) on delete restrict
);

-- Table tickets
create table if not exists ia_desk.tickets(
    id bigint generated always as identity primary key,
    uuid uuid not null default gen_random_uuid(),

    created_at timestamp not null default now(),
    created_by_id bigint not null,

    updated_at timestamp not null default now(),
    updated_by_id bigint not null,

    deleted_at timestamp null,
    deleted_by_id bigint null,
    
    code varchar(16) not null,
    conversation_id bigint null,
    client_id bigint null,
    requester_id bigint not null,
    technician_id bigint null,
    shift_id bigint null,
    status varchar(64) not null,
    parent_ticket_id bigint null,
    resolved_at timestamp null,
    
    constraint uk_ia_desk_tickets_code unique (code),
    constraint uk_ia_desk_tickets_uuid unique (uuid),
    
    constraint uk_ia_desk_tickets_conversation_id foreign key (conversation_id)
      references ia_desk.conversations(id) on delete restrict,
    
    constraint uk_ia_desk_tickets_client_id foreign key (client_id)
      references ia_desk.clients(id) on delete restrict,
    
    constraint uk_ia_desk_tickets_requester_id foreign key (requester_id)
      references ia_desk.requesters(id) on delete restrict,
    
    constraint uk_ia_desk_tickets_technician_id foreign key (technician_id)
      references ia_desk.technicians(id) on delete restrict,
    
    constraint uk_ia_desk_tickets_shift_id foreign key (shift_id)
      references ia_desk.shifts(id) on delete restrict,
    
    constraint uk_ia_desk_tickets_parent_ticket_id foreign key (parent_ticket_id)
      references ia_desk.tickets(id) on delete restrict,
    
    constraint uk_ia_desk_tickets_created_by_id foreign key (created_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_tickets_updated_by_id foreign key (updated_by_id)
      references auth.users(id) on delete restrict,
    
    constraint uk_ia_desk_tickets_deleted_by_id foreign key (deleted_by_id)
      references auth.users(id) on delete restrict
);