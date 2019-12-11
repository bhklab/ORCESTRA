var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes/router');
var cors = require('cors');
const port = 5000;

var app = express();

// support json encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('js', path.join(__dirname, 'js'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

var corsOptions = {
  origin: '*',
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
});

module.exports = app;
