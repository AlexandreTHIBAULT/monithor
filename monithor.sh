cd source
nohup node --env-file=../.env app.js > ../monithor.log 2>&1 &
echo $! > ../.monithor_pid