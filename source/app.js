import express from "express";
import si from "systeminformation";
import dotenv from "dotenv";

const app = express();

dotenv.config({path: '../.env'})

const PORT = process.env.PORT;
const UPDATE_TIME = process.env.UPDATE_TIME;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log(`Access app on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {

    /*si.blockDevices()
        .then(
            (data) => {
                data.forEach(device => {
                    if(device.type=="disk" && device.fsType!="swap") {
                        console.log(device.name);
                        console.log(device.model);
                        console.log(device.physical);
                        console.log(humanFileSize(device.size));
                        console.log(device);
                    }
                });
            }
        )
        .catch((error) => console.error(error));*/

    

    res.render('index', {update_time: UPDATE_TIME});
});

///////////////////////
///////////////////////
///////////////////////

app.get('/osinfo', (req, res) => {
    si.osInfo()
        .then(
            (data) => {
                res.send(data)
            }
        )
        .catch((error) => console.error(error));
})

app.get('/disk', (req, res) => {
    si.fsSize()
        .then(
            (data) => {
                var result = [];
                data.forEach(device => {
                    result.push({
                        name: device.mount,
                        used: humanFileSize(device.used),
                        size: humanFileSize(device.size),
                        usedPct: device.use,
                    })

                });
                res.send(result)
            }
        )
        .catch((error) => console.error(error));
})

app.get('/mem', (req, res) => {
    si.mem()
        .then(
            (data) => {
                res.send({
                    total: humanFileSize(data.total),
                    active: humanFileSize(data.active),
                    activeGraph: round(data.active/data.total*100, 1),
                })
            }
        )
        .catch((error) => console.error(error));
})

app.get('/cpu', (req, res) => {
    si.currentLoad()
        .then(
            (data) => {
                res.send({
                    currentLoad: round(data.currentLoad, 0.01),
                    currentLoadGraph: round(data.currentLoad, 1),
                })
            }
        )
        .catch((error) => console.error(error));
})

app.get('/uptime', (req, res) => {
    var a = si.time().uptime;

    var d = Math.floor(a/(3600*24));
    var h = Math.floor(a/3600 - d*24);
    var m = Math.floor(a/60 - d*24*60 - h*60);

    res.send({
        day: d,
        hour: h,
        minute: m,
    })

})

///////////////////////
///////////////////////
///////////////////////

function humanFileSize(size) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

function round(x, y){
    var d = 1/y;
    return Math.round(x*d)/d ;
}