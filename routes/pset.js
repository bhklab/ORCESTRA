const fs = require('fs');

module.exports = {
    
    editPsetPage: (req, res) => {
        let PsetId = req.params.id;
        let query = "SELECT * FROM `psets` WHERE id = '" + PsetId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-Pset.ejs', {
                title: "Edit  Pset"
                ,Pset: result[0]
                ,message: ''
            });
        });
    },
    editPset: (req, res) => {
        let PsetId = req.params.id;
        let metadata = req.body.metadata;

        let query = "UPDATE `psets` SET `metadata` = '" + metadata + "' WHERE `psets`.`id` = '" + PsetId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/psets');
        });
    },
    deletePset: (req, res) => {
        let PsetId = req.params.id;
        let deleteUserQuery = 'DELETE FROM psets WHERE `psets`.`id` = "' + PsetId + '"';

        db.query(deleteUserQuery, (err, result) => {
           if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/psets');
       });
    }
};
