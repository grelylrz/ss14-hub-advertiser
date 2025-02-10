const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();
const portBase = 4000; // TODO

const serverCount = 5; // change
process.on('uncaughtException', e => {console.error(e.stack); console.log('Node NOT Exiting...,')})
const filesDir = path.join(__dirname, 'files');
const getip = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('E:', error);
    return null;
  }
};
const getRandomPort = () => {
  return Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
};
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.get('/info', (req, res) => {
  res.sendFile(path.join(filesDir, 'info.json'));
});
app.get('/status', (req, res) => {
  res.sendFile(path.join(filesDir, 'status.json'));
});
const advertiseServer = (serverAddress) => {
  axios.post('https://hub.spacestation14.com/api/servers/advertise', { Address: serverAddress })
    .then(response => {
      console.log(`Server advertised successfully: ${serverAddress}`, response.data);
    })
    .catch(error => {
      if (error.response) {
        console.error(`Error advertising server ${serverAddress}:`, error.response.data);
        console.error('HTTP Status Code:', error.response.status);
      } else if (error.request) {
        console.error(`No response received for server ${serverAddress}:`, error.request);
      } else {
        console.error(`Error setting up request for server ${serverAddress}:`, error.message);
      }
    });
};
const adv = async () => {
  const externalIp = await getip();
  if (!externalIp) {
    console.error('E');
    return;
  }
  for (let i = 0; i < serverCount; i++) {
    const randomPort = getRandomPort();
    const serverAddress = `ss14://${externalIp}:${randomPort}/`;
    console.log(serverAddress)
    app.listen(randomPort, () => {
      console.log(`Started as http://${externalIp}:${randomPort}`);
      advertiseServer(serverAddress);
    });
  }
};
adv();
