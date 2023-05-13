const express = require('express');
const path = require('path');
const app = express();
const port = 5353;
const fs = require('fs');

// Read sayings from file
let sayings;
fs.readFile('sayings.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading sayings.txt:', err);
    sayings = [];  // Default to empty array
  } else {
    sayings = data.split('\n');  // Split file contents into array
  }
});

app.use(express.static(path.join(__dirname, '/src')));

// Serve sayings.txt file
app.get('/sayings', (req, res) => {
  res.sendFile(path.join(__dirname + '/sayings.txt'));
});

// Serve images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Provide API endpoint to get list of image file names
app.get('/api/images', (req, res) => {
  fs.readdir(path.join(__dirname, 'images'), (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      res.status(500).send('Error reading images directory');
    } else {
      res.json(files);  // Send list of file names as JSON
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});