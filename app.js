const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const router = require('./routes/router');
//const port = 80;
//const port = process.env.PORT || 3000
require('dotenv').config();

// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cookieParser());
app.set('js', path.join(__dirname, 'js'));

app.use('/', router);

app.use(express.static(path.join(__dirname, 'build'))); // configure express to use public folder

app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: './build' });
});

module.exports = app;