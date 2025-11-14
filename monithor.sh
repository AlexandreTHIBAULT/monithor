cd source
nohup node app.js > ../monithor.log 2>&1 &
echo $! > ../.monithor_pid