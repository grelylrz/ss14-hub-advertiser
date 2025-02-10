const axios = require('axios');
const express = require('express');
const path = require('path');

const maxPlayers = 300;
players = maxPlayers;
const filesDir = path.join(__dirname, 'files'); // база для последующего изменения под картинки.
port = 1212;
ip = "121.127.37.17" // GOL

// templates
const statusTemplate = {"name":"СБЭУ Стрекочет | Localduty - лучшая локалка!","players":1723,"tags":[],"map":null,"round_id":8,"soft_max_players":5000,"panic_bunker":false,"baby_jail":false,"run_level":1,"preset":"\u0421\u0435\u043A\u0440\u0435\u0442"};
const infoTemplate = {"connect_address":"","auth":{"mode":"Required","public_key":"h9/LkNgIKvPihU7/DFM22F\u002BuerH\u002BVIVWyKPXaxZNICc="},"build":{"engine_version":"238.0.0","fork_id":"syndicate-public","version":"e301f52e655c57d6df4a0475e75eb4b24f64e0e4","download_url":"https://cdn.station14.ru/fork/syndicate-public/version/e301f52e655c57d6df4a0475e75eb4b24f64e0e4/file/SS14.Client.zip","hash":"7670B58E1A0A39C33D5AB882194BB29D60951C3F88DB93EFB1E92F6648CCBDE2","acz":false,"manifest_download_url":"https://cdn.station14.ru/fork/syndicate-public/version/e301f52e655c57d6df4a0475e75eb4b24f64e0e4/download","manifest_url":"https://cdn.station14.ru/fork/syndicate-public/version/e301f52e655c57d6df4a0475e75eb4b24f64e0e4/manifest","manifest_hash":"9AF4E8A392C87A4BDB60CDA83A59AFCE4DEF439FF44E6094DF077295A6964C7E"},"desc":"Гойда!"}

// func
process.on('uncaughtException', e => {console.error(e.stack); console.log('Node NOT Exiting...,')})

// Смотрите req-template.
async function advertiseServer(serverAddress) {
    axios.post('https://hub.spacestation14.com/api/servers/advertise', { Address: serverAddress })
        .then(response => {
            console.log('Server advertised successfully:', response.data);
        })
        .catch(error => {
            if (error.response) {
                console.error('Error advertising server:', error.response.data);
                console.error('HTTP Status Code:', error.response.status);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        });
}
function createServer() {
    let sport = port++; // доо я даун.
    let app = express();

    let serverInfo = JSON.parse(JSON.stringify(infoTemplate));
    let serverStatus = JSON.parse(JSON.stringify(statusTemplate));

    serverStatus.players = players--;
    let serverAddress = `ss14://${ip}:${sport}/`;

    console.log(`Created as ${serverAddress}`);

    app.use((req, res, next) => {
      console.log(`${req.method} ${req.originalUrl}`);
      next();
    });
    app.get('/info', (req, res) => {
      res.json(serverInfo);
    });
    app.get('/status', (req, res) => {
      res.json(serverStatus);
    });

    function getPort() {
        return sport;
    }
    function getApp() {
        return app;
    }
    function setPlayers(newPlayers) {
        serverStatus.players = newPlayers;
    }
    function getAddress() {
        return serverAddress;
    }
    function startExpress(newName) {
        serverStatus.name = newName;
        app.listen(sport, () => {
            console.log(`Started with name ${serverStatus.name}`);
        });
    }
    function advertise() {
        advertiseServer(serverAddress);
    }
    return { getPort, getApp, setPlayers, advertise, getAddress, startExpress }
}
/*
Usage
server = createServer();
server.startExpress();
server.advertise();
*/

function main() {
    let servers = [];
    // TODO: сделать автоматическое разделение символьной картинки.
    let messages = [
        "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
        " ▓▓▓▀░░░░░▄██▄░░░░░▀▓▓▓ ",
        "▓▓░░░░░▄▄██▀░░░░░░░░▓▓ ",
        "▓░░░░░▄██▀░░░░░▄█▄░░░░░▓ ",
        "▌░░░░░▀██▄▄▄█████▄░░░░▐ ",
        "░░▄▄▄░░░▀████▀░▀▀██▄░░ ",
        "░░▀██▄░▄▄████▄░░░▀▀▀░░ ",
        "▌░░░▀█████▀▀▀██▄░░░░░▐ ",
        "▓░░░░░▀█▀░░░░▄██▀░░░░░▓ ",
        "▓▓░░░░░░░░▄██▀░░░░░░▓▓ ",
        "▓▓▓▄░░░░░▀█▀▀░░░░░▄▓▓▓"
    ];
    console.log(`Starting ${messages.length}`)  
    try {
        for(let gol = 0; gol < messages.length; gol++) {
            crs = createServer();
            servers.push(crs);
            crs.startExpress(messages[gol]);
        }
        console.log('Servers created.');
        servers.forEach(server => {
            server.advertise();
        });
        /*setInterval(() => {
            console.log("gol")
        }, 5000);*/
    } catch(e) {
        console.log(e);
    }
}
main();
