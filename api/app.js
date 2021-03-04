var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var mysql = require("mysql");
var dotenv = require("dotenv");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var cookieParser = require("cookie-parser");


dotenv.config({path: './.env'})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");

var session = require('express-session');
var db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
})
db.connect( (error) => {
  if (error) {
    console.log(error)
  } else{
    console.log("MYSQL Connected...")
  }
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser());

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);
app.post('/auth', function(req, res){
  
  const name = req.body.FullName;
  const email = req.body.email;
  const password = req.body.password;

  console.log(req.body);
  console.log(name, email, password);

  let hashedPassword = bcrypt.hashSync(password, 8);

  console.log(hashedPassword);

  db.query("SELECT * FROM Teachers WHERE email = ?",  [email], function (err, result) {
    if (result.length > 0) {
      return res.redirect('http://localhost:3000/!register');
    } else {
      db.query("INSERT INTO Teachers SET ?", {teacher_name: name, email: email, password: hashedPassword}, function (err, result) {
        if (err) throw err;
        return res.redirect('http://localhost:3000/registered');
      });
    }
  });
})

app.post('/login', function(req, res){
  try {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password);

    db.query("SELECT * FROM Teachers WHERE email = ?",  [email], function (error, result) {
      console.log(result)
      if (result.length == 0 || !(bcrypt.compareSync(password, result[0].password))){
        res.status(401).redirect("http://localhost:3000/error")
      } else {
        const id = result[0].id;

        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions);
        res.status(200).redirect("http://localhost:3000/user");
      }
    });
  } catch (error) {
    console.log(error);
  }
  
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
