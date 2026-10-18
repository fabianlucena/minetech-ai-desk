do $$
begin
    if not exists (
        select 1 
        from pg_constraint con
        join pg_namespace nsp ON nsp.oid = con.connamespace
        where nsp.nspname = 'ia_desk' 
          and con.conname = 'uk_ia_desk_settings_key'
    ) then
        alter table ia_desk.settings add constraint uk_ia_desk_settings_key unique ("key");
    end if;
end $$;

alter table ia_desk.requesters add column if not exists authenticated_at timestamp null;
alter table ia_desk.requesters add column if not exists auth_state varchar(64) null;
alter table ia_desk.requesters add column if not exists failed_auth_attempts int null;
alter table ia_desk.requesters add column if not exists last_failed_auth_attempt_at timestamp null;
alter table ia_desk.requesters add column if not exists authentication_expires_at timestamp null;

insert into ia_desk.settings (created_by_id,updated_by_id,"key","description",value)
	values 
    (1,1,'failedAuthBlockedTime','Tiempo de bloqueo (en segundos) para un solicitante que falló en la autentificación','3600'::jsonb),
    (1,1,'maxFailedAuthAttempts','Número máximo de intentos de autentificación permitidos al solicitante, antes de bloquearlo','3'::jsonb),
    (1,1,'authenticationExpirationDays','Tiempo en días en que un solicitante puede realizar consultas antes de solicitar su authentificación nuevamente','60'::jsonb)
on conflict ("key") do nothing;

alter table ia_desk.conversation_messages add column if not exists reply_to_id bigint NULL;
do $$
begin
    if not exists (
        select 1 
        from pg_constraint con
        join pg_namespace nsp ON nsp.oid = con.connamespace
        where nsp.nspname = 'ia_desk' 
          and con.conname = 'uk_ia_desk_conversation_messages_reply_to_id'
    ) then
        alter table ia_desk.conversation_messages add constraint uk_ia_desk_conversation_messages_reply_to_id
            foreign key (reply_to_id) references  ia_desk.conversation_messages(id);
    end if;
end $$;