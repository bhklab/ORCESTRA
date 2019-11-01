//const fs = require('fs');
const request = require('request');
const dbUtil = require('../db/dbUtil');

const getPsetList = function(req, res){
    //let query = "SELECT * FROM `psets` ORDER BY id ASC"; // query database to get all the psets
    //let db = dbUtil.getDB();
    //db.connect();
    // // execute query
    // db.query(query, (err, result) => {
    //     if (err) {
    //         res.redirect('/');
    //     }
    //     res.render('index.ejs', {
    //         title: "Generated PSets"
    //         ,psets: result
    //     });
    // });

    res.json([{id: 3, username: "samsepi0l"}, {id: 4, username: "D0loresH4ze"}]);
}

const editPsetPage = function(req, res){
    // let PsetId = req.params.id;
    // let query = "SELECT * FROM `psets` WHERE id = '" + PsetId + "' ";
    // db.query(query, (err, result) => {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //     res.render('edit-Pset.ejs', {
    //         title: "Edit  Pset"
    //         ,Pset: result[0]
    //         ,message: ''
    //     });
    // });
}

const editPset = function(req, res){
    // let PsetId = req.params.id;
    // let metadata = req.body.metadata;

    // let query = "UPDATE `psets` SET `metadata` = '" + metadata + "' WHERE `psets`.`id` = '" + PsetId + "'";
    // db.query(query, (err, result) => {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //     res.redirect('/psets');
    // });
}

const deletePset = function(req, res){
//     let PsetId = req.params.id;
//     let deleteUserQuery = 'DELETE FROM psets WHERE `psets`.`id` = "' + PsetId + '"';

//     db.query(deleteUserQuery, (err, result) => {
//        if (err) {
//             return res.status(500).send(err);
//         }
//         res.redirect('/psets');
//    });
}

module.exports = {
    getPsetList,
    editPsetPage,
    editPset,
    deletePset
};
