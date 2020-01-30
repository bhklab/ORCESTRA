const client = require('../grpc/grpc-client');

const fs = require('fs');
const path = require('path');

module.exports = {
    createPipeline: function(req, res, next){
        
        // works
        // let request = {
        //     "pipeline": {
        //         "name": "edges"
        //     },
        //     "description": "A pipeline that performs image edge detection by using the OpenCV library.",
        //     "transform": {
        //         "cmd": [ "python3", "/edges.py" ],
        //         "image": "pachyderm/opencv"
        //     },
        //     "input": {
        //         "pfs": {
        //             "repo": "images",
        //             "glob": "/*"
        //         }
        //     }
        // }

        // works
        // let request = {
        //     pipeline: {
        //         name: "edges"
        //     },
        //     description: "A pipeline that performs image edge detection by using the OpenCV library.",
        //     transform: {
        //         cmd: [ "python3", "/edges.py" ],
        //         image: "pachyderm/opencv"
        //     },
        //     input: {
        //         pfs: {
        //             repo: "images",
        //             glob: "/*"
        //         }
        //     }
        // }

        // works
        // let request = {};
        // request.pipeline = {name: "edges"};
        // request.description = "A pipeline that performs image edge detection by using the OpenCV library.";
        // request.transform = {cmd: [ "python3", "/edges.py" ], image: "pachyderm/opencv"}
        // request.input = {pfs: {repo: "images", glob: "/*"}}

        //works
        // let filePath = path.join(__dirname, '../test/getGRAYP_2013.json')
        // let requestRaw = fs.readFileSync(filePath);
        // const request = JSON.parse(requestRaw);
        // request.update = true;
        // request.reprocess = true;
        // console.log(request);
        //const obj = JSON.parse(request);

        console.log("createPipeline");
        
        client.createPipeline(req.request, (result) => {
            if(result.status){
                console.log("pipeline created");
                next();
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