sudo -u deploy /bin/bash
cd /opt/minetech-ai-desk
git fetch --all --prune
git checkout dev
git pull origin dev

cd /opt/minetech-ai-desk/frontend
npm i
npm run build

cd /opt/minetech-ai-desk/backend
npm i
npm run dev