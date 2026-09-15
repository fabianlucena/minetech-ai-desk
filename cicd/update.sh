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