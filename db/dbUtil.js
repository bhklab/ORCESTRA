var mysql = require('mysql');

let host = ""; //fs.readFileSync(process.env.DBhost, "utf8")
let user = ""; //fs.readFileSync(process.env.DBuser, "utf8")
let pwd = ""; //fs.readFileSync(process.env.DBpass, "utf8")
let name = ""; //fs.readFileSync(process.env.DBname, "utf8")

let _db = mysql.createConnection ({
    host: host,
    user: user,
    password: pwd,
    database : name
});

module.exports = {
    connect: function(){
       _db.timeout = 0;
       _db.connect((err) => {
           _db.timeout = 0;
           setInterval(function(){
               _db.query('SELECT 1');
           }, 5000);
           if(err){
               throw err;
           }
           console.log('Connected to database');
       }); 
    },
    getDB: function(){
        return _db;
    }
}