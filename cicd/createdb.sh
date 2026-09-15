sudo -u postgres psql
create database minetech_ai_desk;
create user minetech_ai_desk WITH PASSWORD '{strong password}';
grant all privileges on database minetech_ai_desk to minetech_ai_desk;
\q

psql -h localhost -U minetech_ai_desk -d minetech_ai_desk -f /opt/minetech-ai-desk/backend/db_scripts/operations/create.sql