const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require('path')
// const bcryptjs = require("bcryptjs")
const mysql = require("mysql2")
// const session = require('express-session');
const dotenv = require('dotenv').config();
const { check, validationResult, Result } = require('express-validator');
const { error } = require("console")
const { ifError } = require("assert")
// const { createConnection } = require('net');
// const { connect } = require("http2")
// const { callbackify } = require("util")
// const { ifError } = require("assert")

//inititalize app
const app = express();


//cofigure middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));
// app.use(session({
//     secret: 'secret',
//     resave: true, 
//     saveUninitialized: false 
// }));

// database connecting

const pool = mysql.createPool({
   
    host: process.env.DB_HOST, 
    host: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,  
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0

});





pool.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

mysql.connect((err) => { 
    if (err) return console.log('error connecting to the database');
    console.log('successully connected');
});

pool.query('CREATE DATABASE IF NOT EXISTS injustice_ob', (err, result) => {
    if (err) return err; 
    console.log('database created successfull')
});

pool.query('USE injustice_ob', (err, result) => { 
    if (err) return (err);
    console.log('database initiated')


    const LandCasesTablequery = `CREATE TABLE IF NOT EXISTS LandCases(
                          Case_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
                          FirstName VARCHAR(50) NOT NULL,
                          SecondName VARCHAR(50) NOT NULL ,
                          Age INT(255) NOT NULL,
                          Residence VARCHAR NOT NULL,   
                          Land_Serial_Code VARCHAR NOT NULL,
                          TitleDeed_Serial_Code VARCHAR NOT NULL,
                          Land_Size INT NOT NULL,
                          GPS INT NOT NULL,
                          FirstName2 VARCHAR(50) NOT NULL,
                          SecondName2 VARCHAR(50) NOT NULL ,
                          Residence VARCHAR NOT NULL,
                          Occupation VARCHAR NOT NULL,
                          Details VARCHAR NOT NULL
                      )`

    pool.query(LandCasesTablequery, (err, res) => {
        if (err) return console.log('Land table exists');
        console.log('Land Table created');
    });
    const PropertyCasesTablequery = `CREATE TABLE IF NOT EXISTS PropertyCases(
        PCase_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
        FirstName VARCHAR(50) NOT NULL, 
        SecondName VARCHAR(50) NOT NULL ,
        Age INT(255) NOT NULL,
        Residence VARCHAR NOT NULL,   
        Item_Name VARCHAR NOT NULL,
        Property_Location VARCHAR NOT NULL,
        Approximate_Size INT NOT NULL,
        GPS INT NOT NULL,
        FirstName2 VARCHAR(50) NOT NULL,
        SecondName2 VARCHAR(50) NOT NULL ,
        Residence VARCHAR NOT NULL,
        Occupation VARCHAR NOT NULL,
        Details VARCHAR NOT NULL
    )`

  

    pool.query(PropertyCasesTablequery, (err, res) => {
        if (err) return console.log(err);
        console.log('Property Table created');
    });
});
// render stactic files
app.use(express.static('public'))

//show Land form
app.get('/land', (req, res) => {
    res.sendFile(path.join(__dirname, 'land.html'));
});


const Case = {
    tableName: 'LandCases',

    createUSER: function (newCase, callback) {
        const sql = `INSERT INTO ${this.tableName} (FirstName, SecondName, Age,Residence,landSerial,TitleSerial,hectares,GPS,FirstName2,SecondName2,Residence2,Occupation,brief) VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,?)`;
        const values = [newCase.FirstName, newCase.SecondName, newCase.Age, newCase.Residence, newCase.landSerial, newCase.TitleSerial, newCase.hectares, newCase.GPS, newCase.FirstName2, newCase.SecondName2, newCase.Residence2, newCase.Occupation, newCase.brief];
        pool.query(sql, values, callback);
    },

    //   getuserbyName: function (FirstNamel, callback) {
    //     const sql = `SELECT * FROM ${this.tableName} WHERE FirstName = ?`;
    //     pool.query(sql, [FirstName], [callback]);
    //   },

};



// Land route
app.post('/Land',

   
       async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(401).json({ errors: errors.array() });
        }
      
       
      
  const newCase = {

    FirstName: req.body.FirstName,
    SecondName: req.body.SecondName,
    Age: req.body.Age,
    Residence: req.body.Residence,
    landSerial: req.body.landSerial,
    TitleSerial: req.body.TitleSerial,
    hectares: req.body.hectares,
    GPS: req.body.GPS,
    FirstName2: req.body.FirstName2,
    SecondName2: req.body.SecondName2,
    Residence2: req.body.Residence2,
    Occupation: req.body.Occupation,
    brief: req.body.brief
     };



// Inserting new User
User.createUSER(newUser, (err, result) => {
    if (err) return res.status(500).json({ err: err.message });

    console.log('Inserted successfully with ID: ' + result.insertId);
    return res.status(200).json(newUser);
});
});



app.listen(7000, () => {
    console.log('port 8000 is active ');
});
