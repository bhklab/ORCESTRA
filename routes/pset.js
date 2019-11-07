//const fs = require('fs');
const request = require('request');
const dbUtil = require('../db/dbUtil');

function restructureData(dataset){
    tools = '';
    for(i = 0; i < dataset.length; i++){
        dataset[i].rnaTool = flattenArray(dataset[i].rnaTool);
        dataset[i].rnaRef = flattenArray(dataset[i].rnaRef);
        dataset[i].exomeTool = flattenArray(dataset[i].exomeTool);
        dataset[i].exomeRef = flattenArray(dataset[i].exomeRef);
    }
    return dataset;
}

function flattenArray(arrayData){
    var str ='';
    for(let i = 0; i < arrayData.length; i++){
        str += arrayData[i];
        str += '\n';
    }
    return(str);
}

const getPsetList = function(req, res){
    dbUtil.selectPSets(req.query, function(result){
        if(result.status = 'success'){
            var dataset = restructureData(result.data);
            res.send(dataset);
        }else{
            res.status(500).send(result.data);
        }
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
