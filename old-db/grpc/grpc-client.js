const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const protoDir = path.join(__dirname, 'proto-files');
//const pachydermIP = process.env.PACHYDERM_IP;

function grpcGetVersion(request, pachydermIP, errorCallback, successCallback){
    const getVersionProto = path.join(protoDir, 'getVersion', 'version.proto');
    const packageDefinition = protoLoader.loadSync(getVersionProto);
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const client = new proto.versionpb.API(pachydermIP, grpc.credentials.createInsecure());

    client.GetVersion(request, (error, response) => {
        if(error){
            //console.error(error);
            errorCallback({status: 0, response: error});
        }else{
            //console.log(response);
            successCallback({status: 1, response: response});
        }
    })
}

module.exports = {

    createPipeline: function(request, pachydermIP, callback){
        const createPipelineProto = path.join(protoDir, 'createPipeline', 'pps.proto');
        const packageDefinition = protoLoader.loadSync(createPipelineProto);
        const proto = grpc.loadPackageDefinition(packageDefinition);
        
        // 52.233.32.47:30650
        const client = new proto.pps.API(pachydermIP, grpc.credentials.createInsecure());

        client.CreatePipeline(request, (error, response) => {
            if(error) { 
                console.error(error);
                callback({status: 0, response: error});
            }else{
                console.log(response);
                callback({status: 1, response: response});
            }
        });
    },

    getVersion: function(request, pachydermIP){
        return new Promise((resolve, reject) => {
            grpcGetVersion(
                request, 
                pachydermIP,
                (errorCallback) => {
                    reject(errorCallback)
                },
                (successCallback) => {
                    resolve(successCallback)
                }
            );
            setTimeout(() => {reject({status: 0, response: new Error('timeout')})}, 3000);
        })
    }
}