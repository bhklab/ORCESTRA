var mysql = require('mysql');

let host = "pachydermdatabase.mysql.database.azure.com"; //fs.readFileSync(process.env.DBhost, "utf8")
let user = "anthony@pachydermdatabase"; //fs.readFileSync(process.env.DBuser, "utf8")
let pwd = "Bhklab1234@"; //fs.readFileSync(process.env.DBpass, "utf8")
let database = "pachyderm"; //fs.readFileSync(process.env.DBname, "utf8")

let _db = mysql.createConnection ({
    host: host,
    user: user,
    password: pwd,
    database : database,
    port: 3306
});

module.exports = {
    // connect: function(){
    //    _db.timeout = 0;
    //    _db.connect((err) => {
    //        _db.timeout = 0;
    //        setInterval(function(){
    //            _db.query('SELECT 1');
    //        }, 5000);
    //        if(err){
    //         console.log("Error!!!");   
    //         throw err;
    //        }
    //        console.log('Connected to database');
    //    }); 
    // },
    getDB: function(){
        return _db;
    },

    // executeQuery: function(query){
    //     _db.query(query, (err, result) => {
    //         if (err) {
    //             console.log("Error: executeQuery");
    //             return(err);
    //         }
    //         return(result);
    //     });
    // },

    selectAllPSets: function(callback){
        let query = "SELECT * FROM `psets` ORDER BY id ASC"; // query database to get all the psets
        _db.query(query, (err, result) => {
            callback(err, result);
        });
    }
}