const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb");
const bodyParser = require("body-parser");
const app = express();


/// importing routes for posting and getting
/// questions
const questionRoutes = require('./routes/question');
/// users
const userRoutes = require('./routes/user');
/// email
const emailRoutes = require('./routes/email');


/// connection to the database
mongoose
  .connect(
    "mongodb+srv://tech387:KQ3g2wDJcsu4d8M@pricecalculator.ztcak.mongodb.net/users-answers?retryWrites=true&w=majority", {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
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
app.use(bodyParser.urlencoded({
  extended: false
}));

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

app.post("/sendmail", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMail(user, info => {
    res.status(201).json({
      message: 'Email sent succesfully'
    });
  }).then(() => {
    console.log(`The mail has been sent and the id is ${info.messageId}`);
  });
});

async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  /// ovdje ce biti email od kompanije
  const companyEmail = 'dzefkadzefka@gmail.com';

  let mailOptions = {
    from: '"Tech387 - App Estimation"<technodemailer@gmail.com>', // sender address
    to: user.usersEmail,
    companyEmail, // list of receivers
    subject: "Regards from Tech387 Team - Here is your app estimation", // Subject line
    html: `<h1>Hi ${user.usersName}</h1><br>
                <p>We are very happy for contacting you.</p>
                <p>We want to send you your app estimation.</p> <hr>
                <p>Estimated time for your app was ${user.estimatedTime} hours</p>
          <p>Your estimated app price was $ ${user.estimatedPrice}</p> <br><br><br><br>
    <h4>We can't wait to hear from you again. Cheers!!!</h4>`
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log('Error!!', err)
    } else {
      console.log('Email sent!')
    }
  });

  callback(info);
}
app.use("/api/JSON", questionRoutes);
app.use('/api/user', userRoutes);
app.use('/sendmail', emailRoutes);

module.exports = app;