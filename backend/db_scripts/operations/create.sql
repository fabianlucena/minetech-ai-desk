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