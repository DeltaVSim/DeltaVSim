const express = require('express');
const app = express();
const path = require('path');
app.use(express.static('public'));
app.use(express.json());
port = 3000;

app.listen(port, () => {
  console.log(`DeltaVSim started on ${port}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/levels', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/levels.html'));
});

app.get('/simulator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/simulator.html'));
});

app.post('/getLevel', (req, res) => {
  const level = req.body.level;
  res.sendFile(path.join(__dirname, 'levels/level'+level+'.json'));
})