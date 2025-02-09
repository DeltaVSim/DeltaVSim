const express = require('express');
const app = express();
const path = require('path');
app.use(express.static('public'))
port = 3000

app.listen(port, () => {
    console.log(`DeltaVSim started on ${port}`);
  });

  app.get('/', (req, res) => {
    console.log('/ made from: ' + req.ip)
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
  app.get('/levels', (req, res) => {
    console.log('/levels made from: ' + req.ip)
    res.sendFile(path.join(__dirname, 'public/levels.html'));
  });
  app.get('/simulator', (req, res) => {
    console.log('/simulator made from: ' + req.ip)
    res.sendFile(path.join(__dirname, 'public/simulator.html'));
  });

  app.post('/getLevel', (req, res) => {
    console.log('/getlevel made from: ' + req.ip)
    const { level } = req.body;
    res.sendFile(path.join(__dirname, 'levels/level'+level+'.json'));
  })