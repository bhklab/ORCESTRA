'use strict'

//pachctl create repo images
//pachctl put file images@master:liberty.png -f http://imgur.com/46Q8nDz.png

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const protoDir = path.join(__dirname, 'proto-files');
const PORT = 30650 || process.env.PORT;
const server = new grpc.Server();

// const createRepoProto = path.join(protoDir, 'createRepo', 'pfs.proto');
// const packageDefinitionCreateRepo = protoLoader.loadSync(createRepoProto);
// const protoCreateRepo = grpc.loadPackageDefinition(packageDefinitionCreateRepo);
// server.addService(protoCreateRepo.pfs.API.service, {
//     CreateRepo(call, callback) {
//       console.log(`Recieved request ${JSON.stringify(call.request, undefined, 2)}`);
//       // Returns an empty response
//       let res = {}
//       callback(null, res);
//     }
// });

const createPipelineProto = path.join(protoDir, 'createPipeline', 'pps.proto');
const packageDefinitionCreatePipeline = protoLoader.loadSync(createPipelineProto);
const protoCreatePipeline = grpc.loadPackageDefinition(packageDefinitionCreatePipeline);
server.addService(protoCreatePipeline.pps.API.service, {
    CreatePipeline(call, callback) {
      console.log(`Recieved request ${JSON.stringify(call.request, undefined, 2)}`)
      // Returns an empty response
      let res = {}
      callback(null, res)
    }
});

const listJobsProto = path.join(protoDir, 'listJobs', 'pps.proto');
const packageDefinitionListJobs = protoLoader.loadSync(listJobsProto);
const protoListJobs = grpc.loadPackageDefinition(packageDefinitionListJobs);
server.addService(protoListJobs.pps.API.service, {
    ListJob(call, callback) {
      console.log(`Recieved request ${JSON.stringify(call.request, undefined, 2)}`)
      // Returns an empty response
      let res = {}
      callback(null, res)
    }
});

server.bind(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure())
server.start()
console.log(`GRPC server is running on ${PORT}`)
