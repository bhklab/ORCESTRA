const client = require('../grpc/grpc-client');

const fs = require('fs');
const path = require('path');

module.exports = {
    createPipeline: function(req, res, next){
        if(req.isOnline){
            console.log("createPipeline");
            // client.createPipeline(req.request, (result) => {
            //     if(result.status){
            //         console.log("pipeline created");
            //         req.pset.dateProcessed = new Date(Date.now());
            //         next();
            //     }else{
            //         res.send({status: 0, message: 'error in pipeline creation'});
            //     }
            // });
            req.pset.dateProcessed = new Date(Date.now());
            next();
        }else{
            next();
        }
    },

    checkOnline: function(req, res, next){
        const online = true;
        req.isOnline = online;
        next();
    }
}