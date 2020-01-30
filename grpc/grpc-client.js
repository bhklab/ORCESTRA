const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const protoDir = path.join(__dirname, 'proto-files');
const pachydermIP = process.env.PACHYDERM_IP;

module.exports = {

    // createRepo: function(callback){
    //     const createRepoProto = path.join(protoDir, 'createRepo', 'pfs.proto');
    //     const packageDefinition = protoLoader.loadSync(createRepoProto);
    //     const proto = grpc.loadPackageDefinition(packageDefinition);

    //     const client = new proto.pfs.API('0.0.0.0:30650', grpc.credentials.createInsecure());

    //     let request = {
    //         'repo': {
    //             'name': 'test'
    //         },
    //         'description': "Some repository description",
    //         'update': false
    //     }

    //     client.CreateRepo(request, (error, response) => {
    //         if(error) { 
    //             console.error(error);
    //             callback({status: 0});
    //         }else{
    //             console.log(response);
    //             callback({status: 1});
    //         } 
    //     });
    // },

    createPipeline: function(request, callback){
        const createPipelineProto = path.join(protoDir, 'createPipeline', 'pps.proto');
        const packageDefinition = protoLoader.loadSync(createPipelineProto);
        const proto = grpc.loadPackageDefinition(packageDefinition);

        // 52.228.28.251
        const client = new proto.pps.API(pachydermIP, grpc.credentials.createInsecure());

        client.CreatePipeline(request, (error, response) => {
            if(error) { 
                console.error(error);
                callback({status: 0});
            }else{
                console.log(response);
                callback({status: 1});
            }
        });
    },

    listJobs: function(request, callback){
        const listJobsProto = path.join(protoDir, 'listJobs', 'pps.proto');
        const packageDefinition = protoLoader.loadSync(listJobsProto);
        const proto = grpc.loadPackageDefinition(packageDefinition);

        const client = new proto.pps.API('0.0.0.0:30650', grpc.credentials.createInsecure())

        client.ListJob(request, (error, response) => {
            if(error) { 
                console.error(error);
                callback({status: 0});
            }else{
                console.log(response);
                callback({status: 1, response: response});
            }
        })
    }
}