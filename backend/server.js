const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let reports = [];

app.post('/save', (req, res) => {
  const { spots, notes } = req.body;

  const report = {
    id: reports.length + 1,
    spots,
    notes
  };

  reports.push(report);
  res.json(report);
});

app.get('/reports', (req, res) => {
  res.json(reports);
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});