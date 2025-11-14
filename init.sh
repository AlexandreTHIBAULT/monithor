chmod +x monithor.sh
chmod +x stop.sh

cd source
npm ci --omit=dev && npm cache clean --force
