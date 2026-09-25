sudo su - deploy
cd /opt/minetech-ai-desk/backend
pm2 start npm --name "minetech-ia-desk" -- start
pm2 save
pm2 startup

# Comandos útiles de gestión
#   Ver estado del proceso: pm2 status
#   Ver logs en tiempo real: pm2 logs minetech-ia-desk -lines 100
#   Reiniciar aplicación: pm2 restart minetech-ia-desk
#   Detener aplicación: pm2 stop minetech-ia-desk