const express = require('express');
const path = require('path');
const app = express();
const port = 1212; // поменяйте на нужный порт указанный в теймплейте реквеста
const filesDir = path.join(__dirname, 'files');

app.use((req, res, next) => {
  console.log(${req.method} ${req.originalUrl});
  next();
});
app.get('/info', (req, res) => {
  res.sendFile(path.join(filesDir, 'info.json'));
});
app.get('/status', (req, res) => {
  res.sendFile(path.join(filesDir, 'status.json'));
});
app.listen(port, () => {
  console.log("Ready!");
});
