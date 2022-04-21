/**
 * API routes for adding / removing user's favirote data objects.
 * Used in data object search/request view and profile view.
 */
const User = require('../../new-db/models/user');
const mongoose = require('mongoose');

const add = async (req, res) => {
    let result = {};
    try{
        let objectIDs = req.body.datasetId.map(str => mongoose.Types.ObjectId(str));
        await User.updateOne(
            {email: req.decoded.username},
            {$addToSet: {userDataObjects: objectIDs}}
        );
        result = {summary: 'Datasets Saved', message: 'The selected datasets have been saved.'};
    }catch(error){
        console.log(error);
        result = error;
        res.status(500);
    }finally{
        res.send(result);
    }
}

const remove = async (req, res) => {
    let result = {};
    try{
        let objectIDs = req.body.datasetId.map(str => mongoose.Types.ObjectId(str));
        await User.updateOne(
            {email: req.decoded.username},
            {$pullAll: {userDataObjects: objectIDs}}
        );
    }catch(error){
        console.log(error);
        result = error;
        res.status(500);
    }finally{
        res.send(result);
    }
}

module.exports = {
    add,
    remove
}