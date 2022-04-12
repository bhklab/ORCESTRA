require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const router = require('./routes/router');
const db = require('./new-db/mongoose');

const listen = () => {
  app.listen(port, ()=>{
    console.log('Server running on port: ' + port);
  });
}

app.use(cors());

// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cookieParser());
app.set('js', path.join(__dirname, 'js'));

app.use('/api', router);

app.use(express.static(path.join(__dirname, 'client/build'))); // configure express to use public folder

app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: './client/build' });
});

var port = process.env.PORT || '2000';
app.set('port', port);

// database connection setting.
db.connection
    .on('error', console.log)
    .on('disconnected', db.connect)
    .once('open', listen);

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', db.gracefulExit).on('SIGTERM', db.gracefulExit);

module.exports = app; // for testing