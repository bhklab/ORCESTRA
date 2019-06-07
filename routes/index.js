var express = require('express');
var mysql = require('mysql');
var router = express.Router();
const shell = require('shelljs');

var app = express();


const fs = require('fs');
const doAsync = require('doasync');

let param1 = fs.readFileSync(process.env.DBhost, "utf8")
let param2 = fs.readFileSync(process.env.DBuser, "utf8")
let param3 = fs.readFileSync(process.env.DBpass, "utf8")
let param4 = fs.readFileSync(process.env.DBname, "utf8")

var connection = mysql.createConnection({
  host: param1,
  user: param2,
  password: param3,
  database : param4
});



app.use(express.static('public'))

router.get('/', function(req, res, next) {
  	res.render('index');
});



router.post('/execute', function (req, res, next) {
	const osr = req.body.osr;
    const genomer = req.body.genomer;
    const g2r = req.body.g2r;
	const verr = req.body.verr;
    const corr = req.body.corr;
    const phr2 = req.body.phr2;
    const bvr = req.body.bvr;
    const email = req.body.email;


connection.connect(function(err) {
  if (err) throw err;
  var sql = "SELECT DOI FROM test WHERE dataset = ('" + osr + "') AND genome = ('" + genomer + "')";
  // var sql = "INSERT INTO test (dataset, tester) VALUES ('" + osr + "', '" + genomer + "')";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);



    if (result === undefined || result.length == 0) {

   console.log("empty" + result);
   var sql2 = "INSERT INTO test(`dataset`, `genome`) VALUES ('" + osr + "', '" + genomer + "')";

   connection.query(sql2, function (err, result) {
   if (err) throw err;
   console.log(result);



      });

}
  });

  connection.end();
});



    fs.writeFile("/home/app/selection.txt",  osr + '\n' + genomer + '\n' + g2r + '\n' + verr + '\n' + corr + '\n' + phr2 + '\n' + bvr + '\n' + email , function (err) {
    shell.exec('/home/app/getpset.sh');
    // Checks if there is an error
    if (err) return console.log(err);
    });
    
    
    res.send('success');
});


module.exports = router;





