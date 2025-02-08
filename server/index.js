const express = require('express');
const app = express();
port = 80

app.listen(port, () => {
    console.log(`DeltaVSim started on ${port}`);
  });

  app.get('/', (req, res) => {
    console.log('/ made from: ' + req.ip)
    res.send('/webpage/index.html')
  });