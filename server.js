const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const { validationResult } = require("express-validator");

// Initialize the app
const app = express();

// Configure middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

// Ensure the database is created
pool.query('CREATE DATABASE IF NOT EXISTS injustice_ob', (err) => {
  if (err) return console.error('Error creating database:', err.message);
  console.log('Database injustice_ob created successfully');
});

// Use the database
pool.query('USE injustice_ob', (err) => {
  if (err) return console.error('Error selecting database:', err.message);
  console.log('Using injustice_ob database');

  // Create LandCases table if it doesn't exist
  const LandCasesTableQuery = `CREATE TABLE IF NOT EXISTS LandCases(
    Case_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    SecondName VARCHAR(50) NOT NULL,
    Age INT NOT NULL,
    Residence VARCHAR(100) NOT NULL,
    Land_Serial_Code VARCHAR(50) NOT NULL,
    TitleDeed_Serial_Code VARCHAR(50) NOT NULL,
    Land_Size INT NOT NULL,
    GPS VARCHAR(50) NOT NULL,
    FirstName2 VARCHAR(50) NOT NULL,
    SecondName2 VARCHAR(50) NOT NULL,
    Residence2 VARCHAR(100) NOT NULL,
    Occupation VARCHAR(50) NOT NULL,
    Details TEXT NOT NULL
  )`;

  pool.query(LandCasesTableQuery, (err) => {
    if (err) return console.error('Error creating LandCases table:', err.message);
    console.log('LandCases table created successfully');
  });
});

// Model for interacting with LandCases table
const Case = {
  tableName: 'LandCases',

  createUSER: function (newCase, callback) {
    const sql = `INSERT INTO ${this.tableName} 
      (FirstName, SecondName, Age, Residence, Land_Serial_Code, TitleDeed_Serial_Code, Land_Size, GPS, FirstName2, SecondName2, Residence2, Occupation, Details) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      newCase.FirstName,
      newCase.SecondName,
      newCase.Age,
      newCase.Residence,
      newCase.landSerial,
      newCase.TitleSerial,
      newCase.hectares,
      newCase.GPS,
      newCase.FirstName2,
      newCase.SecondName2,
      newCase.Residence2,
      newCase.Occupation,
      newCase.brief,
    ];
    pool.query(sql, values, callback);
  },
};

// Show Land form (static HTML)
app.get('/land', (req, res) => {
  res.sendFile(path.join(__dirname, 'land.html'));
});

// Handle form submission
app.post('/land', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newCase = {
    FirstName: req.body.FirstName,
    SecondName: req.body.SecondName,
    Age: req.body.Age,
    Residence: req.body.Residence,
    landSerial: req.body.Land_Serial_Code,
    TitleSerial: req.body.TitleDeed_Serial_Code,
    hectares: req.body.Land_Size,
    GPS: req.body.GPS,
    FirstName2: req.body.FirstName2,
    SecondName2: req.body.SecondName2,
    Residence2: req.body.Residence2,
    Occupation: req.body.Occupation,
    brief: req.body.Details,
  };

  // Insert new case into LandCases table
  Case.createUSER(newCase, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    console.log('New case inserted with ID: ' + result.insertId);
    return res.status(201).json(newCase);
  });
});

// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
