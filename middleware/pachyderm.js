const grpc = require('../grpc/grpc-client');

module.exports = {
    createPipeline: function(req, res, next){
        if(req.isOnline){
            console.log("createPipeline");
            // grpc.createPipeline(req.request, (result) => {
            //     if(result.status){
            //         console.log("pipeline created");
            //         req.pset.dateProcessed = new Date(Date.now());
            //         next();
            //     }else{
            //         res.send({status: 0, message: 'error in pipeline creation'});
            //     }
            // });
            req.dateProcessed = new Date(Date.now());
            next();
        }else{
            next();
        }
    },

    checkOnline: function(req, res, next){
        const online = true;
        req.isOnline = online;
        next();
    },

    handleOffline: function(req, res, next){
        if(req.isOnline){
            next();
        }else{
            const resData = {summary: 'Pachyderm is offline', message: 'The resuest could not be submitted. Please try again when pachyderm is online.'}; 
            res.status(500).send(resData);
        }
    },

    returnStatus: function(req, res){
        res.send({isOnline: req.isOnline});
    }
}