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

//database connecting

// const pool = mysql.createPool({
   
//     host: process.env.DB_HOST, 
//     host: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,  
//     waitForConnections: true,
//     connectionLimit: 10,
//     maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
//     idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
//     queueLimit: 0,
//     enableKeepAlive: true,
//     keepAliveInitialDelay: 0

// });



const pool = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root" , // replace with your MySQL username
  password: `#200366# `,  // replace with your MySQL password
  database: "injustice_ob"   // replace with your database name
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

    // const ExpensesTablequery = `CREATE TABLE IF NOT EXISTS Expense(
    //                             Expense_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    //                             Category VARCHAR(50) NOT NULL UNIQUE,
    //                             Amount VARCHAR(50) NOT NULL UNIQUE,
    //                             USER_ID INT,
    //                             FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID),
    //                             Date Date NOT NULL
    //                             )`

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

// //login form
// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'login.html'));
// });

// // Expense form
// app.get('/expense', (err, res) => {
//   res.sendFile(path.join(__dirname, '/expenses.html'))
// });

// user representation

const Case = {
    tableName: 'LandCases',

    createUSER: function (newCase, callback) {
        const sql = `INSERT INTO ${this.tableName} (FirstName, SecondName, Age,Residence,landSerial,TitleSerial,hectares,GPS,FirstName2,SecondName2,Residence2,Occupation,brief) VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,?)`;
        const values = [newCase.FirstName, newCase.SecondName, newCase.Age, newCase.Residence, newCase.landSerial, newCase.TitleSerial, newCase.hectares, newCase.GPS, newCase.FirstName2, newCase.SecondName2, newCase.Residence2, newCase.Occupation, newCase.brief];
        pool.query(sql, values, callback);
    },

    //   getuserbyName: function (Email, callback) {
    //     const sql = `SELECT * FROM ${this.tableName} WHERE Email = ?`;
    //     pool.query(sql, [Email], callback);
    //   },

    //   getuserbyUsername: function (Username, callback) {
    //     const sql = `SELECT * FROM ${this.tableName} WHERE Username = ?`
    //     pool.query(sql, [Username], callback);
    //   }
};



// Land route
app.post('/Land',

    // [
    //     check('Email').isEmail().withMessage('Email should be valid'),
    //     check('Username').isAlphanumeric().withMessage('Should be alphabetic or numbers'),
    //     check('Password').isLength({ min: 6 }).withMessage('Minimum of six characters'),
      
    //     // Custom validation for Email
    //     check('Email').custom(async (value) => {
    //       const userByEmail = await User.getuserbyEmail(value);
    //       if (userByEmail) throw new Error('Email already exists');
    //     }),
      
    //     // Custom validation for Username
    //     check('Username').custom(async (value) => {
    //       const userByUsername = await User.getuserbyUsername(value);
    //       if (userByUsername) throw alert(new Error(alert('Username already exists')));
    //     })
    //   ],
       async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(401).json({ errors: errors.array() });
        }
      
        // Hash Password
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(req.body.Password, saltRounds);
      
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


app.post('/login', async (req, res) => {
    try {
        const { Username, Password } = req.body;



        // Ensure Password is a string
        const plainPassword = String(Password);

        // Retrieve user data from the database
        User.getuserbyUsername(Username, (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.length === 0) return res.status(401).json('User does not exist');

            const user = result[0];
            console.log('User data from DB:', user);
            console.log('User hashed password:', user.Password, typeof user.Password);

            // Compare the provided password with the hashed password in the database
            const isCorrect = bcryptjs.compareSync(plainPassword, user.Password);  // Make sure plainPassword is a string

            if (!isCorrect) return res.status(400).json('Invalid username or password');

            // Store user data in the session
            req.session.UserID = La.USER_ID;  // Corrected field to match user.USER_ID
            req.session.Username = user.Username;

            // Save session and redirect
            req.session.save((err) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("filed successful")
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'An internal error occurred. Please try again later.' });
    }
});




// //expense
// const Expense = {
//   tableName: "expense",
//   createExpense: (newExpense, callback) => {
//     pool.query(`INSERT INTO ${Expense.tableName} SET ?, [newExpense], callback`)
//   },
//   deleteExpense: (expenseID, callback) => {
//     pool.query(`DELETE FROM ${Expense.tableName} WHERE expenseID = ?, [expenseID], callback`);
//   },
//   getExpenseByUserID: (userID, callback) => {
//     pool.query(`SELECT * FROM ${Expense.tableName} WHERE userID = ?, [userID], callback`);
//   },
//   updateExpense: (expenseID, updatedExpense, callback) => {
//     pool.query(`UPDATE ${Expense.tableName} SET ? WHERE expenseID = ?, [updatedExpense, expenseID], callback`);
//   },
// };
// // Add a new expense
// app.post('/expenses', (req, res) => {
//   const { Amount, Category, Date, Name } = req.body;
//   const UserID = req.session.UserID;
//   console.log(req.body)
//   console.log(UserID)



//   if (!Amount || !Category || !Date ) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   const q = "INSERT INTO expense(`Category`, `Amount`, `User_ID`, `Date`, `Name`) VALUES (?)"

//   const newExpense =
//   [
//     Category,
//     Amount,
//     UserID,
//     Date,
//     Name
//   ];


//    pool.query(q, [newExpense], (error, result) => {
//     if (error) {
//       console.error('Error adding Expense: ' + error.message);
//       return res.status(500).json({ error: error.message });
//     }

//     res.status(200).json({ message: 'Expense added successfully' });
//   });
// });
// // Retrieve all expenses for a user
// app.get('/expenses/:userID', (req, res) => {
//   const userID = req.params.userID;

//   if (!userID) {
//     return res.status(400).json({ error: 'User ID is required' });
//   }
//   Expense.getExpensesByUserID(userID, (error, results) => {
//     if (error) {
//       console.error('Error retrieving expenses: ' + error.message);
//       return res.status(500).json({ error: error.message });
//     }
//     res.status(200).json(results);

//   });
// });
// //updating an existing expense.

// app.put('/expenses/:id', (req, res) => {
//   const expenseID = req.params.id;
//   const { Amount, Category, date } = req.body;


//   if (!Username || !Amount || !Category || !date) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }
//   //creating updatedExpense object
//   const updatedExpense = {
//     Amount: Amount,
//     Category: Category,
//     Date: Date
//   };

//   Expense.updateExpense(expenseID, updatedExpense, (error, result) => {
//     if (error) {
//       console.error('Error updating expense: ' + error.message);
//       return res.status(500).json({ error: error.message });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Expense not found' });
//     }
//     console.log('Updated expense with id ' + expenseID);
//     res.status(200).json({ message: 'Expense updated successfully' });
//   });
// });



app.listen(7000, () => {
    console.log('port 8000 is active ');
});