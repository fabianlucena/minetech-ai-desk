alter table ia_desk.clients add column if not exists next_ticket_number int default 1 not null;
