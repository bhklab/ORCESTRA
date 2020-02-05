const mongo = require('../db/mongo');

module.exports = {
    getFormData: async function(req, res){
        const result = await mongo.selectFormData();
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    }
}