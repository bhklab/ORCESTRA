const client = require('../grpc/grpc-client');

module.exports = {
    createPipeline: function(req, res, next){
        
        let request = {
            "pipeline": {
                "name": "edges"
            },
            "description": "A pipeline that performs image edge detection by using the OpenCV library.",
            "transform": {
                "cmd": [ "python3", "/edges.py" ],
                "image": "pachyderm/opencv"
            },
            "input": {
                "pfs": {
                    "repo": "images",
                    "glob": "/*"
                }
            }
        }
        
        client.createPipeline(request, (result) => {
            if(result.status){
                setTimeout(function(){next()}, 5000);
            }else{
                res.send({status: 0, message: 'error in pipeline creation'});
            }
        });
    },

    listJob: function(req, res, next){
        
        let request = {
            'pipeline': {
                'name': 'edges'
            },     
            'update': false
        }
        
        client.listJobs(request, (result) => {
            if(result.status){
                res.send({status: 1, response: result.response});
            }else{
                res.send({status: 0, message: 'error in pipeline creation'});
            }
        });
    }
}