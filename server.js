const express = require('express');
const path = require('path');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const port = 5353;
const fs = require('fs');

// Initialize SQLite database
const db = new sqlite3.Database('banished.sqlite3', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the local SQlite database.');
});

// Create tables for hidden images and quotes
db.run('CREATE TABLE IF NOT EXISTS hidden_images (name TEXT)');
db.run('CREATE TABLE IF NOT EXISTS hidden_quotes (quote TEXT)');

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

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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

app.post('/api/hideImage', async (req, res) => {
  const imageName = req.query.imageName;
  if (!imageName || !imageName.length) {
    return res.status(400).send('Missing imageName, use: \'?imageName=ugulugacat.jpg\'');
  }
  try {
    // Check if the image is already hidden
    const row = await new Promise((resolve, reject) => {
      db.get('SELECT name FROM hidden_images WHERE name = ?', imageName, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    if (row) {
      // Image is already hidden
      return res.status(400).send('Image is already hidden');
    } else {
      // Hide the image
      await new Promise((resolve, reject) => {
        db.run('INSERT INTO hidden_images VALUES (?)', imageName, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      return res.status(200).send('Image hidden successfully');
    }
  } catch (err) {
    console.error('Error hiding image:', err);
    res.status(500).send('Error hiding image');
  }
});

app.post('/api/hideQuote', async (req, res) => {
  const quote = decodeURIComponent(req.query.quote);
  if (!quote || !quote.length) {
    return res.status(400).send('Missing quote, use: \'?quote=I fink u freaky!\'');
  }
  try {
    // Check if the quote is already hidden
    const row = await new Promise((resolve, reject) => {
      db.get('SELECT quote FROM hidden_quotes WHERE quote = ?', quote, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    if (row) {
      // Quote is already hidden
      return res.status(400).send('Quote is already hidden');
    } else {
      // Hide the quote
      await new Promise((resolve, reject) => {
        db.run('INSERT INTO hidden_quotes VALUES (?)', quote, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      return res.status(200).send('Quote hidden successfully');
    }
  } catch (err) {
    console.error('Error hiding quote:', err);
    return res.status(500).send('Error hiding quote');
  }
});

// Get hidden quotes
app.get('/api/hiddenQuotes', async (req, res) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM hidden_quotes', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    res.status(200).json(rows);  // Send hidden quotes as JSON
  } catch (err) {
    console.error('Error reading from quotes table:', err);
    res.status(500).send('Error getting hidden quotes');
  }
});

// Get hidden images
app.get('/api/hiddenImages', async (req, res) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM hidden_images', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    res.status(200).json(rows);  // Send hidden images as JSON
  } catch (err) {
    console.error('Error reading from images table:', err);
    res.status(500).send('Error getting hidden images');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});


// Catch all 500 error page
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});