const getHome = function(req, res){
  res.json([{id: 1, username: "test1"}, {id: 2, username: "test2"}]);
}

module.exports = {
  getHome
}

// var express = require('express');
// var router = express.Router();
// var app = express();
// app.use(express.static('public'));

// unused objects. to be used later
// const fs = require('fs');
// const doAsync = require('doasync');
// const shell = require('shelljs');

// Get home page (index.html)
// router.get('/', function(req, res, next) {
//   	res.render('index');
// });

// module.exports = router;

// router.post('/execute', function (req, res, next) {
// 	const osr = req.body.osr;
//     const genomer = req.body.genomer;
//     const g2r = req.body.g2r;
// 	const verr = req.body.verr;
//     const corr = req.body.corr;
//     const phr2 = req.body.phr2;
//     const bvr = req.body.bvr;
//     const email = req.body.email;


// connection.connect(function(err) {
//   if (err) throw err;
//   var sql = "SELECT DOI FROM test WHERE dataset = ('" + osr + "') AND genome = ('" + genomer + "')";
//   // var sql = "INSERT INTO test (dataset, tester) VALUES ('" + osr + "', '" + genomer + "')";
//   connection.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log(result);



//     if (result === undefined || result.length == 0) {

//    console.log("empty" + result);
//    var sql2 = "INSERT INTO test(`dataset`, `genome`) VALUES ('" + osr + "', '" + genomer + "')";

//    connection.query(sql2, function (err, result) {
//    if (err) throw err;
//    console.log(result);



//       });

// }
//   });

//   connection.end();
// });



//     fs.writeFile("/home/app/selection.txt",  osr + '\n' + genomer + '\n' + g2r + '\n' + verr + '\n' + corr + '\n' + phr2 + '\n' + bvr + '\n' + email , function (err) {
//     shell.exec('/home/app/getpset.sh');
//     // Checks if there is an error
//     if (err) return console.log(err);
//     });
    
    
//     res.send('success');
// });








