const express = require('express');
const app = express();
const path = require('path');
port = 80

app.listen(port, () => {
    console.log(`DeltaVSim started on ${port}`);
  });

  app.get('/', (req, res) => {
    console.log('/ made from: ' + req.ip)
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

  app.get('/getlevel', (req, res) => {
    console.log('/getlevel made from: ' + req.ip)
    const { level } = req.body;
    res.sendFile(path.join(__dirname, 'levels/level'+level+'.json'));
  })