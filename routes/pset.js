//const fs = require('fs');
const request = require('request');
const dbUtil = require('../db/dbUtil');

const getPsetList = function(req, res){
    dbUtil.selectAllPSets(function(err, result){
        if(err){
            console.log("Error: selectAllPSets");
            res.status(500).send(err);
        }
        //console.log("Success: selectAllPSets");
        res.json(result);
    });   
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
