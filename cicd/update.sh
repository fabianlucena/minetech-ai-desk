sudo su - deploy
cd /opt/minetech-ai-desk
git fetch --all --prune
git checkout dev
git pull origin dev

cd /opt/minetech-ai-desk/frontend
npm i
npm run build

cd /opt/minetech-ai-desk/backend
npm i
pm2 restart minetech-ia-desk --update-env

# Comandos útiles de gestión
#   Ver estado del proceso: pm2 status
#   Ver logs en tiempo real: pm2 logs minetech-ia-desk --lines 100
#   Reiniciar aplicación: pm2 restart minetech-ia-desk
#   Detener aplicación: pm2 stop minetech-ia-desk