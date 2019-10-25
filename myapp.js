const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const router = require('./routes/router');
const port = 2000;

// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

// [view engine] setup
//app.set('views', path.join(__dirname, '/views'));
app.set('js', path.join(__dirname, 'js'));
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');

app.use('/', router);

app.set('port', process.env.port || port); // set express to use this port
app.use(express.static(path.join(__dirname, 'client'))); // configure express to use public folder

app.listen(port, () => {
  console.log(`Server running on port: 2000`);
});

//Change local host to domain on GoDaddy. http://publicip:3000

//  const {getHomePage} = require('./routes/index2');
//  const {deletePset, editPset, editPsetPage} = require('./routes/pset');

//set public path;
// var publicDir = path.join(__dirname,'/public');
// app.use(express.static(publicDir));

// app.route('/requestPSet')
//  	.get(function (req, res) {
// 		res.sendFile(__dirname + '/views/request.html');;
// 	});


//const fs = require('fs');
//const doAsync = require('doasync');

// routes for the app

// app.use(fileUpload()); // configure fileupload
// app.get('/psets', getHomePage);
// app.get('/edit/:id', editPsetPage);
// app.get('/delete/:id', deletePset);
// app.post('/edit/:id', editPset);