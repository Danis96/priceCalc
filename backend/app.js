const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb");
const bodyParser = require("body-parser");
const app = express();

/// getting the schemas
const User = require('./models/userInput');
const Questions = require('./models/questions');

/// connection to the database
mongoose
  .connect(
    "mongodb+srv://tech387:KQ3g2wDJcsu4d8M@pricecalculator.ztcak.mongodb.net/users-answers?retryWrites=true&w=majority"
  )
    /// connection success
  .then(() => {
    console.log("Connected to database");
  })
    /// connection failed
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/// we want to allow all possible client apps to comunicate with our server
/// to do that and to avoid CORS errors we need to set the headers
/// so we create another middleware  where we setHeader to access only our browser understand
/// and with the next we go to the next middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

/// post in db
app.post('/api/user', (req, res, next) => {
     const userAnswer = new User({
       answers: req.body.answer,
       time: req.body.estimatedTime,
       price: req.body.estimatedPrice,
       name: req.body.usersName,
       email: req.body.usersEmail
     });
     console.log(userAnswer);
     userAnswer.save();
     res.status(201).json({
          message: 'Users answers added succesfully'
     });
});


app.get("/api/JSON", (req, res, next) => {
  Questions.find().then(questions => {
      console.log(questions.toString());
      res.status(200).json({
          message: "Questions fetched succesfully",
          json: questions,
      });
  });

});

module.exports = app;