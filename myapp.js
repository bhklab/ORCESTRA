var express = require('express');
const fileUpload = require('express-fileupload');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
const {getHomePage} = require('./routes/index2');
const {deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');
const port = 2000;

// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// [view engine] setup
app.set('views', path.join(__dirname, '/views'));
app.set('js', path.join(__dirname, 'js'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// first param is a path - second param is a callback defined above
var index = require('./routes/index'); 
app.use('/', index);

// set public path
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

app.route('/requestPSet')
 	.get(function (req, res) {
		res.sendFile(__dirname + '/views/request.html');;
	});



// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
  host: "pachydermdatabase.mysql.database.azure.com",
  user: "anthony@pachydermdatabase",
  password: "Bhklab1234@",
  database : 'pachyderm' 
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;



// routes for the app
app.set('port', process.env.port || port); // set express to use this port
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
app.get('/psets', getHomePage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/edit/:id', editPlayer);


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

//Change local host to domain on GoDaddy. http://publicip:3000
